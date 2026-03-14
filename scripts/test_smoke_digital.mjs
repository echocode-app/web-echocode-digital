import {
  assert,
  buildDigitalSmokeArtifacts,
  buildPdfBytes,
  cleanupDigitalSmokeData,
  ensureScriptEnv,
  fetchJson,
  generateRunId,
  getFirestoreDb,
  getStorageBucket,
  parseSmokeArgs,
  resolveBaseUrl,
  saveSmokeManifest,
  waitFor,
} from './shared/digital_smoke.utils.mjs';

function buildJsonHeaders(sessionId) {
  return {
    'Content-Type': 'application/json',
    'x-client-session-id': sessionId,
  };
}

async function findLatestAnalyticsMatch(predicate) {
  const firestore = getFirestoreDb();
  const snapshot = await firestore
    .collection('analytics_events')
    .orderBy('timestamp', 'desc')
    .limit(250)
    .get();

  return (
    snapshot.docs.find((doc) => {
      const data = doc.data();
      return predicate(data, doc.id);
    }) ?? null
  );
}

async function main() {
  await ensureScriptEnv();

  const args = parseSmokeArgs(process.argv.slice(2));
  const runId = args.get('run-id')?.trim() || generateRunId();
  const baseUrl = resolveBaseUrl(args.get('base-url'));
  const artifacts = buildDigitalSmokeArtifacts(runId);
  const firestore = getFirestoreDb();
  const bucket = getStorageBucket();
  const pdfBytes = buildPdfBytes(runId);

  const state = {
    runId,
    baseUrl,
    uploadPath: null,
    submissionIds: [],
  };

  await saveSmokeManifest(runId, state);

  console.log(`digital smoke run: ${runId}`);
  console.log(`base url: ${baseUrl}`);

  try {
    const firebaseCheck = await fetchJson(`${baseUrl}/api/internal/firebase-check`);
    assert(firebaseCheck.ok, 'firebase-check request failed');
    assert(firebaseCheck.data?.success === true, 'firebase-check did not return success envelope');
    assert(firebaseCheck.data?.data?.status === 'ok', 'firebase-check did not return ok status');
    console.log('1/5 firebase connectivity ok');

    const pageViewResponse = await fetchJson(`${baseUrl}/api/analytics/page-view`, {
      method: 'POST',
      headers: buildJsonHeaders(artifacts.sessionId),
      body: JSON.stringify({
        path: artifacts.pageView.path,
        url: `${baseUrl}${artifacts.pageView.path}?utm_source=smoke_test&utm_medium=automation&utm_campaign=${artifacts.attribution.campaign}`,
        title: artifacts.pageView.title,
        referrer: artifacts.pageView.referrer,
        source: artifacts.pageView.source,
        siteId: 'echocode_digital',
        siteHost: 'www.echocode.digital',
        attribution: artifacts.attribution,
      }),
    });
    assert(pageViewResponse.ok, 'page-view request failed');

    const pageViewDoc = await waitFor('page_view analytics event', async () => {
      return findLatestAnalyticsMatch((data) => {
        const metadata = data.metadata ?? {};
        return (
          data.eventType === 'page_view' &&
          data.siteId === 'echocode_digital' &&
          metadata.path === artifacts.pageView.path &&
          metadata.sessionId === artifacts.sessionId
        );
      });
    });

    assert(pageViewDoc, 'page_view analytics event was not persisted');
    console.log('2/5 page view analytics ok');

    const emailResponse = await fetchJson(`${baseUrl}/api/forms/email-submissions`, {
      method: 'POST',
      headers: buildJsonHeaders(artifacts.sessionId),
      body: JSON.stringify({
        email: artifacts.emailSubmission.email,
        source: artifacts.emailSubmission.source,
        siteId: 'echocode_digital',
        siteHost: 'www.echocode.digital',
        attribution: artifacts.attribution,
      }),
    });
    assert(emailResponse.ok, 'email submission request failed');
    assert(emailResponse.data?.success === true, 'email submission did not return success');
    state.submissionIds.push(emailResponse.data.data.id);
    await saveSmokeManifest(runId, state);

    const emailDoc = await waitFor('email submission record', async () => {
      const snapshot = await firestore
        .collection('email_submissions')
        .where('email', '==', artifacts.emailSubmission.email)
        .limit(1)
        .get();

      return snapshot.docs[0] ?? null;
    });

    assert(emailDoc, 'email submission record was not created');

    const emailEventDoc = await waitFor('submit_email analytics event', async () => {
      return findLatestAnalyticsMatch((data) => {
        const metadata = data.metadata ?? {};
        const attribution = metadata.attribution ?? {};

        return (
          data.eventType === 'submit_email' &&
          metadata.submissionId === emailResponse.data.data.id &&
          attribution.campaign === artifacts.attribution.campaign
        );
      });
    });

    assert(emailEventDoc, 'submit_email analytics event was not persisted');
    console.log('3/5 email submit analytics ok');

    const clientResponse = await fetchJson(`${baseUrl}/api/forms/client-project`, {
      method: 'POST',
      headers: buildJsonHeaders(artifacts.sessionId),
      body: JSON.stringify({
        firstName: artifacts.clientProject.firstName,
        lastName: artifacts.clientProject.lastName,
        email: artifacts.clientProject.email,
        description: artifacts.clientProject.description,
        siteId: 'echocode_digital',
        siteHost: 'www.echocode.digital',
        attribution: artifacts.attribution,
      }),
    });
    assert(clientResponse.ok, 'client project request failed');
    assert(clientResponse.data?.success === true, 'client project did not return success');
    state.submissionIds.push(clientResponse.data.data.id);
    await saveSmokeManifest(runId, state);

    const clientDoc = await waitFor('client submission record', async () => {
      const snapshot = await firestore
        .collection('client_submissions')
        .where('email', '==', artifacts.clientProject.email)
        .limit(1)
        .get();

      return snapshot.docs[0] ?? null;
    });

    assert(clientDoc, 'client submission record was not created');
    console.log('4/5 client project submit ok');

    const uploadInitResponse = await fetchJson(`${baseUrl}/api/forms/uploads/init`, {
      method: 'POST',
      headers: buildJsonHeaders(artifacts.sessionId),
      body: JSON.stringify({
        formType: 'vacancy',
        file: {
          originalName: artifacts.vacancy.fileName,
          mimeType: 'application/pdf',
          sizeBytes: pdfBytes.byteLength,
        },
        siteId: 'echocode_digital',
        siteHost: 'www.echocode.digital',
        attribution: artifacts.attribution,
      }),
    });
    assert(uploadInitResponse.ok, 'vacancy upload init request failed');
    assert(uploadInitResponse.data?.success === true, 'vacancy upload init did not return success');

    state.uploadPath = uploadInitResponse.data.data.path;
    await saveSmokeManifest(runId, state);

    const uploadResponse = await fetch(uploadInitResponse.data.data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: pdfBytes,
    });
    assert(uploadResponse.ok, 'signed CV upload failed');

    const [exists] = await bucket.file(state.uploadPath).exists();
    assert(exists, 'uploaded CV object was not found in storage');

    const vacancyResponse = await fetchJson(`${baseUrl}/api/forms/vacancy-submissions`, {
      method: 'POST',
      headers: buildJsonHeaders(artifacts.sessionId),
      body: JSON.stringify({
        profileUrl: artifacts.vacancy.profileUrl,
        cvFile: {
          path: state.uploadPath,
          originalName: artifacts.vacancy.fileName,
          mimeType: 'application/pdf',
          sizeBytes: pdfBytes.byteLength,
        },
        vacancy: {
          vacancyId: artifacts.vacancy.vacancyId,
          vacancySlug: artifacts.vacancy.vacancySlug,
          vacancyTitle: artifacts.vacancy.vacancyTitle,
          level: artifacts.vacancy.level,
          conditions: artifacts.vacancy.conditions,
          employmentType: artifacts.vacancy.employmentType,
        },
        siteId: 'echocode_digital',
        siteHost: 'www.echocode.digital',
        attribution: artifacts.attribution,
      }),
    });
    assert(vacancyResponse.ok, 'vacancy submission request failed');
    assert(vacancyResponse.data?.success === true, 'vacancy submission did not return success');
    state.submissionIds.push(vacancyResponse.data.data.id);
    await saveSmokeManifest(runId, state);

    const vacancyDoc = await waitFor('vacancy submission record', async () => {
      const snapshot = await firestore
        .collection('vacancy_submissions')
        .where('profileUrl', '==', artifacts.vacancy.profileUrl)
        .limit(1)
        .get();

      return snapshot.docs[0] ?? null;
    });

    assert(vacancyDoc, 'vacancy submission record was not created');

    const vacancyEventDoc = await waitFor('submit_vacancy analytics event', async () => {
      return findLatestAnalyticsMatch((data) => {
        const metadata = data.metadata ?? {};
        const attribution = metadata.attribution ?? {};

        return (
          data.eventType === 'submit_vacancy' &&
          metadata.submissionId === vacancyResponse.data.data.id &&
          attribution.campaign === artifacts.attribution.campaign
        );
      });
    });

    assert(vacancyEventDoc, 'submit_vacancy analytics event was not persisted');
    console.log('5/5 vacancy upload + submit analytics ok');

    console.log(`digital smoke passed: ${runId}`);
  } finally {
    try {
      await cleanupDigitalSmokeData({
        runId,
        uploadPath: state.uploadPath,
        verbose: true,
      });
    } catch (cleanupError) {
      console.error(`cleanup failed for ${runId}`);
      console.error(cleanupError instanceof Error ? cleanupError.message : cleanupError);
      console.error(
        `retry: npm run test:smoke:digital:cleanup -- --run-id ${runId}${state.uploadPath ? ` --upload-path ${state.uploadPath}` : ''}`,
      );
    }
  }
}

main().catch((error) => {
  console.error('digital smoke failed');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
