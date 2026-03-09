import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'echocode-admin-dev';
const host = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const [emulatorHost, emulatorPortRaw] = host.split(':');
const emulatorPort = Number(emulatorPortRaw || '8080');
const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

/**
 * Runs a minimal but high-signal rules test suite for current access matrix:
 * - admin has privileged write/read paths
 * - non-admin is blocked from sensitive collections
 * - public reads are allowed only for explicitly public collections
 */
async function run() {
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: emulatorHost,
      port: emulatorPort,
      rules,
    },
  });

  try {
    await testEnv.clearFirestore();

    const anonymousDb = testEnv.unauthenticatedContext().firestore();
    const adminDb = testEnv.authenticatedContext('admin-uid', {
      role: 'admin',
    }).firestore();
    const userDb = testEnv.authenticatedContext('user-uid', {
      role: 'developer',
    }).firestore();
    const now = new Date();

    // Seed public/draft content via admin context without applying rules.
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'vacancies/v-public'), {
        title: 'Frontend Engineer',
        slug: 'frontend-engineer',
        isPublished: true,
        createdAt: now,
        level: 'Middle',
        isHot: true,
        updatedBy: 'admin-uid',
      });
      await setDoc(doc(db, 'vacancies/v-draft'), {
        title: 'Internal Vacancy Draft',
        slug: 'internal-vacancy-draft',
        isPublished: false,
        createdAt: now,
        level: 'Senior',
        isHot: false,
        updatedBy: 'admin-uid',
      });
      await setDoc(doc(db, 'portfolio/p-public'), {
        title: 'Project Alpha',
        slug: 'project-alpha',
        isPublished: true,
        createdAt: now,
      });
      await setDoc(doc(db, 'portfolio/p-draft'), {
        title: 'Internal Portfolio Draft',
        slug: 'internal-portfolio-draft',
        isPublished: false,
        createdAt: now,
      });
    });

    // submissions: sensitive data, admin-only + schema validation
    await assertFails(getDoc(doc(anonymousDb, 'submissions/s1')));
    await assertFails(
      setDoc(doc(userDb, 'submissions/s1'), {
        createdAt: now,
        status: 'new',
        formType: 'project',
        email: 'user@example.com',
      }),
    );
    await assertFails(
      setDoc(doc(adminDb, 'submissions/s-invalid'), {
        // Missing required fields: formType/email
        createdAt: now,
        status: 'new',
      }),
    );
    await assertSucceeds(
      setDoc(doc(adminDb, 'submissions/s1'), {
        createdAt: now,
        status: 'new',
        formType: 'project',
        email: 'user@example.com',
        message: 'Need a quote',
        source: 'website',
      }),
    );
    await assertSucceeds(getDoc(doc(adminDb, 'submissions/s1')));
    await assertFails(
      updateDoc(doc(adminDb, 'submissions/s1'), {
        // Immutable field
        email: 'changed@example.com',
      }),
    );
    await assertSucceeds(
      updateDoc(doc(adminDb, 'submissions/s1'), {
        status: 'in_review',
        updatedAt: new Date(),
      }),
    );

    // vacancies: published-only public read, admin-write + schema/immutable checks
    await assertSucceeds(getDoc(doc(anonymousDb, 'vacancies/v-public')));
    await assertFails(getDoc(doc(anonymousDb, 'vacancies/v-draft')));
    await assertSucceeds(getDoc(doc(adminDb, 'vacancies/v-draft')));
    await assertFails(
      setDoc(doc(adminDb, 'vacancies/v-invalid'), {
        // Missing required fields: slug/isPublished/createdAt
        title: 'Frontend Engineer',
      }),
    );
    await assertFails(
      setDoc(doc(userDb, 'vacancies/v1'), {
        title: 'Frontend Engineer',
        slug: 'frontend-engineer',
        isPublished: true,
        createdAt: now,
      }),
    );
    await assertSucceeds(
      setDoc(doc(adminDb, 'vacancies/v1'), {
        title: 'Frontend Engineer',
        slug: 'frontend-engineer',
        isPublished: true,
        createdAt: now,
        level: 'Middle',
        isHot: false,
        updatedBy: 'admin-uid',
      }),
    );
    await assertFails(
      updateDoc(doc(adminDb, 'vacancies/v1'), {
        // Immutable field
        slug: 'changed-slug',
      }),
    );
    await assertSucceeds(
      updateDoc(doc(adminDb, 'vacancies/v1'), {
        title: 'Senior Frontend Engineer',
        level: 'Senior',
        isHot: true,
        updatedBy: 'admin-uid',
        updatedAt: new Date(),
      }),
    );

    // portfolio: published-only public read, admin-write + schema/immutable checks
    await assertSucceeds(getDoc(doc(anonymousDb, 'portfolio/p-public')));
    await assertFails(getDoc(doc(anonymousDb, 'portfolio/p-draft')));
    await assertSucceeds(getDoc(doc(adminDb, 'portfolio/p-draft')));
    await assertFails(
      setDoc(doc(adminDb, 'portfolio/p-invalid'), {
        // Missing required fields: slug/createdAt
        title: 'Project Alpha',
      }),
    );
    await assertFails(
      setDoc(doc(userDb, 'portfolio/p1'), {
        title: 'Project Alpha',
        slug: 'project-alpha',
        createdAt: now,
      }),
    );
    await assertSucceeds(
      setDoc(doc(adminDb, 'portfolio/p1'), {
        title: 'Project Alpha',
        slug: 'project-alpha',
        createdAt: now,
        image: '/images/portfolio/projects/dummy.png',
        platforms: ['ios', 'android'],
        categories: ['utility'],
        entryType: 'preview_card',
        updatedBy: 'admin-uid',
      }),
    );
    await assertFails(
      updateDoc(doc(adminDb, 'portfolio/p1'), {
        // Immutable field
        slug: 'project-beta',
      }),
    );
    await assertSucceeds(
      updateDoc(doc(adminDb, 'portfolio/p1'), {
        summary: 'Cross-platform cleaning marketplace',
        image: '/images/portfolio/projects/food.png',
        platforms: ['ios', 'android', 'web'],
        categories: ['utility', 'health'],
        updatedBy: 'admin-uid',
        updatedAt: new Date(),
      }),
    );

    // internal collection: never accessible from client SDK
    await assertFails(getDoc(doc(adminDb, '_internal_firebase_checks/c1')));
    await assertFails(setDoc(doc(adminDb, '_internal_firebase_checks/c1'), { ok: true }));

    console.log('Firestore rules test suite passed');
  } finally {
    await testEnv.cleanup();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
