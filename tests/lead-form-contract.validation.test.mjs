import test from 'node:test';
import assert from 'node:assert/strict';

const {
  buildPhoneE164,
  countryCodeSchema,
  personNameSchema,
  phoneContactSchema,
  phoneSchema,
  projectIdentitySchema,
} = await import('../src/shared/validation/submissions.common.ts');

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
