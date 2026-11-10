if (!process.env.TEST_PASSWORD) {
  throw new Error('TEST_PASSWORD is not set. Add it to your .env file or environment.');
}

export const DEFAULT_REGISTRATION_DATA = {
  firstName: 'Test',
  lastName: 'User',
  street: '123 Test Street',
  city: 'Testville',
  state: 'TX',
  zipCode: '12345',
  phone: '555-123-4567',
  ssn: '987-65-4321',
  password: process.env.TEST_PASSWORD,
} as const;
