import { vi } from 'vitest';

export function mockNextAuth(role: string | null = 'customer', userId = 'test-user-id') {
  const session = role
    ? {
        user: {
          id: userId,
          email: 'test@test.com',
          name: 'Test User',
          role,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
    : null;

  vi.doMock('next-auth/next', () => ({
    getServerSession: vi.fn(() => Promise.resolve(session)),
  }));

  return session;
}

export function clearNextAuthMock() {
  vi.doUnmock('next-auth/next');
}
