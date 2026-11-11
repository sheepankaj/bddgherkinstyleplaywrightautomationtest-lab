// Static registration fields — safe to import without any env vars set
export const DEFAULT_REGISTRATION_DATA = {
  firstName: 'Test',
  lastName: 'User',
  street: '123 Test Street',
  city: 'Testville',
  state: 'TX',
  zipCode: '12345',
  phone: '555-123-4567',
  ssn: '987-65-4321',
} as const;

// Called at registration time (inside registerNewUser) — throws only then,
// not at module import time, so bddgen and docker build are unaffected.
export function getTestPassword(): string {
  const pwd = process.env.TEST_PASSWORD;
  if (!pwd) {
    throw new Error('TEST_PASSWORD is not set. Add it to your .env file or environment.');
  }
  return pwd;
}
