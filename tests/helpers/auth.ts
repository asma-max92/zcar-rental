import { prisma } from './db';
import bcrypt from 'bcryptjs';

export async function createTestUser(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName || 'Test',
      lastName: data.lastName || 'User',
      role: data.role || 'customer',
    },
  });
}

export async function createAdminUser(email = 'admin@test.com') {
  return createTestUser({
    email,
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  });
}

export function mockSession(role = 'customer', userId = 'test-user-id') {
  return {
    user: {
      id: userId,
      email: 'test@test.com',
      name: 'Test User',
      role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}
