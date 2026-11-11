import { APIRequestContext } from '@playwright/test';
import { API_URLS } from '../constants/urls';

export type UserResponse = {
  id: number;
  name: string;
  username: string;
  email: string;
};

export class UsersApi {
  constructor(private readonly request: APIRequestContext) {}

  async getUserById(id: number): Promise<{ status: number; body: UserResponse }> {
    const response = await this.request.get(`${API_URLS.users}/${id}`);
    const body = (await response.json()) as UserResponse;
    return { status: response.status(), body };
  }
}
