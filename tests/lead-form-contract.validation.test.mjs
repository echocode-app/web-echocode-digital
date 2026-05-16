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
  turnstileTokenSchema,
} = await importValidationModule();

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
  const output = transpiled.outputText.replace(/from ['"]zod['"]/g, `from ${JSON.stringify(zodUrl)}`);
  const outputDir = path.join(tmpdir(), 'echocode-lead-form-contract-tests');
  const outputPath = path.join(outputDir, 'submissions.common.mjs');

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, output, 'utf8');

  return import(pathToFileURL(outputPath).href);
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

test('turnstileTokenSchema requires a non-empty token', () => {
  assert.equal(turnstileTokenSchema.safeParse('cf-turnstile-token').success, true);
  assert.equal(turnstileTokenSchema.safeParse('   ').success, false);
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
