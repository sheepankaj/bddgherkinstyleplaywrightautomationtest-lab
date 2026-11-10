import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';

export type Credentials = {
  username: string;
  password: string;
};

const storePath = join(process.cwd(), '.tmp', 'registered-user.json');

export const credentialStore = {
  save(creds: Credentials): void {
    mkdirSync(dirname(storePath), { recursive: true });
    writeFileSync(storePath, JSON.stringify(creds, null, 2));
  },

  load(): Credentials {
    if (!existsSync(storePath)) {
      throw new Error(
        `No registered user found at ${storePath}. Run the "Register a new user" scenario first.`
      );
    }
    return JSON.parse(readFileSync(storePath, 'utf-8')) as Credentials;
  },

  clear(): void {
    if (existsSync(storePath)) {
      unlinkSync(storePath);
    }
  },
};
