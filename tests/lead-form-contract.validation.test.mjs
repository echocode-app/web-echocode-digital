import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const {
  buildPhoneE164,
  countryCodeSchema,
  personNameSchema,
  phoneContactSchema,
  phoneSchema,
  projectIdentitySchema,
  // turnstileTokenSchema,
  captchaTokenSchema,
} = await importValidationModule();
const { projectSubmissionSchema } = await importProjectValidationModule();

async function importValidationModule() {
  const sourceUrl = new URL('../src/shared/validation/submissions.common.ts', import.meta.url);
  const sourcePath = fileURLToPath(sourceUrl);
  const source = await readFile(sourcePath, 'utf8');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });

  // Node 20 cannot import .ts directly, so CI tests execute a temporary ESM build.
  const zodUrl = await import.meta.resolve('zod');
  const output = transpiled.outputText.replace(
    /from ['"]zod['"]/g,
    `from ${JSON.stringify(zodUrl)}`,
  );
  const outputDir = path.join(tmpdir(), 'echocode-lead-form-contract-tests');
  const outputPath = path.join(outputDir, 'submissions.common.mjs');

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, output, 'utf8');

  return import(pathToFileURL(outputPath).href);
}

async function transpileTsModuleToTemp(sourceRelativePath, outputName, replacements = {}) {
  const sourceUrl = new URL(sourceRelativePath, import.meta.url);
  const sourcePath = fileURLToPath(sourceUrl);
  const source = await readFile(sourcePath, 'utf8');

  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });

  let output = transpiled.outputText;
  const zodUrl = await import.meta.resolve('zod');
  output = output.replace(/from ['"]zod['"]/g, `from ${JSON.stringify(zodUrl)}`);

  Object.entries(replacements).forEach(([from, to]) => {
    output = output.replaceAll(from, to);
  });

  const outputDir = path.join(tmpdir(), 'echocode-lead-form-contract-tests');
  const outputPath = path.join(outputDir, outputName);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, output, 'utf8');

  return pathToFileURL(outputPath).href;
}

async function importProjectValidationModule() {
  const commonUrl = await transpileTsModuleToTemp(
    '../src/shared/validation/submissions.common.ts',
    'submissions.common.project.mjs',
  );
  const filesUrl = await transpileTsModuleToTemp(
    '../src/shared/validation/submissions.files.ts',
    'submissions.files.project.mjs',
  );
  const projectUrl = await transpileTsModuleToTemp(
    '../src/shared/validation/submissions.project.ts',
    'submissions.project.mjs',
    {
      "from '@/shared/validation/submissions.common'": `from ${JSON.stringify(commonUrl)}`,
      "from '@/shared/validation/submissions.files'": `from ${JSON.stringify(filesUrl)}`,
    },
  );

  return import(projectUrl);
}

test('personNameSchema accepts normal user names', () => {
  const validNames = [
    'test',
    'Anna',
    'Anna Maria',
    "O'Connor",
    'Jean-Luc',
    'McDonald',
    'Олена',
    'Іван-Петро',
    'Łukasz',
  ];

  validNames.forEach((name) => {
    assert.equal(personNameSchema.safeParse(name).success, true, `${name} should be valid`);
  });
});

test('personNameSchema rejects bot-like mixed-case name tokens', () => {
  const invalidNames = [
    'NjWLqISAYrDhfmQkTCtTGRdQ',
    'HhkyJcSiDRUcIfEagjh',
    'kRIvRIngluJxWOvbz',
    'zGiAfhBOtCKjSzvFIfS',
  ];

  invalidNames.forEach((name) => {
    assert.equal(personNameSchema.safeParse(name).success, false, `${name} should be invalid`);
  });
});

test('phone contact schemas accept country code plus national number', () => {
  assert.equal(countryCodeSchema.safeParse('+380').success, true);
  assert.equal(phoneSchema.safeParse('50 123-45-67').success, true);

  const parsed = phoneContactSchema.safeParse({
    countryCode: '+380',
    phone: '50 123-45-67',
  });

  assert.equal(parsed.success, true);
  assert.equal(buildPhoneE164('+380', '50 123-45-67'), '+380501234567');
});

test('phone contact schemas reject unsupported and overlong phone values', () => {
  assert.equal(countryCodeSchema.safeParse('380').success, false);
  assert.equal(phoneSchema.safeParse('abc12345').success, false);

  const parsed = phoneContactSchema.safeParse({
    countryCode: '+380',
    phone: '501234567890123',
  });

  assert.equal(parsed.success, false);
});

// test('turnstileTokenSchema requires a non-empty token', () => {
//   assert.equal(turnstileTokenSchema.safeParse('cf-turnstile-token').success, true);
//   assert.equal(turnstileTokenSchema.safeParse('   ').success, false);
// });

test('captchaTokenSchema requires a non-empty token', () => {
  assert.equal(captchaTokenSchema.safeParse('recaptcha-token').success, true);
  assert.equal(captchaTokenSchema.safeParse('   ').success, false);
});

test('shared echocode.app project contract keeps firstName + lastName + email', () => {
  const validPayload = {
    firstName: 'Anna',
    lastName: 'Kotliar',
    email: 'anna@example.com',
  };

  assert.equal(projectIdentitySchema.safeParse(validPayload).success, true);

  const invalidPayload = {
    firstName: 'Anna',
    countryCode: '+380',
    phone: '50 123 45 67',
    email: 'anna@example.com',
  };

  assert.equal(projectIdentitySchema.safeParse(invalidPayload).success, false);
});

test('echocode.app project submit contract accepts needs without captcha token', () => {
  const parsed = projectSubmissionSchema.safeParse({
    formType: 'project',
    siteId: 'echocode_app',
    siteHost: 'echocode.app',
    source: 'contact_modal',
    firstName: 'Anna',
    lastName: 'Kotliar',
    email: 'anna@example.com',
    needs: 'Project details here',
  });

  assert.equal(parsed.success, true);
});

test('echocode.app project submit contract accepts optional attachment', () => {
  const parsed = projectSubmissionSchema.safeParse({
    formType: 'project',
    siteId: 'echocode_app',
    siteHost: 'echocode.app',
    source: 'contact_modal',
    firstName: 'Anna',
    lastName: 'Kotliar',
    email: 'anna@example.com',
    needs: 'Project details here',
    attachment: {
      path: 'uploads/tmp/brief',
      originalName: 'brief.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 12345,
    },
  });

  assert.equal(parsed.success, true);
});
