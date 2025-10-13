import type { User } from './types';
import { makeFakeUser } from './utils';

export async function fakeLogin(email: string, password: string, role: User['role']) {
  await new Promise((r) => setTimeout(r, 500));
  // In a real app, call your API here and return user data
  return makeFakeUser(email.split('@')[0], email, role);
}

export async function fakeRegister(name: string, email: string, password: string, role: User['role']) {
  await new Promise((r) => setTimeout(r, 500));
  return makeFakeUser(name, email, role);
}
