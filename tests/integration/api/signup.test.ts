import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { POST as signupPOST } from '@/app/api/signup/route';
import { NextRequest } from 'next/server';

function createJsonRequest(url: string, body: object) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/signup', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('POST creates a new user with hashed password', async () => {
    const req = createJsonRequest('http://localhost:3000/api/signup', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '561-555-1234',
      password: 'securepassword123',
    });

    const res = await signupPOST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();

    const user = await prisma.user.findUnique({
      where: { email: 'john@example.com' },
    });
    expect(user).not.toBeNull();
    expect(user?.firstName).toBe('John');
    expect(user?.role).toBe('customer');
    expect(user?.password).not.toBe('securepassword123');
  });

  it('POST returns 409 for duplicate email', async () => {
    await prisma.user.create({
      data: {
        firstName: 'Existing',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'hashedpassword',
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/signup', {
      firstName: 'New',
      lastName: 'User',
      email: 'existing@example.com',
      password: 'password123',
    });

    const res = await signupPOST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe('Email already registered');
  });

  it('POST returns 400 for missing required fields', async () => {
    const req = createJsonRequest('http://localhost:3000/api/signup', {
      firstName: 'John',
    });

    const res = await signupPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing required fields');
  });
});
