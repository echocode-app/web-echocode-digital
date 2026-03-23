import {
  cleanupDigitalSmokeData,
  ensureScriptEnv,
  parseSmokeArgs,
} from './shared/digital_smoke.utils.mjs';

async function main() {
  await ensureScriptEnv();

  const args = parseSmokeArgs(process.argv.slice(2));
  const runId = args.get('run-id')?.trim();
  const uploadPath = args.get('upload-path')?.trim() || null;

  if (!runId) {
    throw new Error('Argument --run-id is required');
  }

  await cleanupDigitalSmokeData({
    runId,
    uploadPath,
    verbose: true,
  });
}

main().catch((error) => {
  console.error('digital smoke cleanup failed');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
