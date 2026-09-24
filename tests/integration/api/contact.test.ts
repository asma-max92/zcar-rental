import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { POST as contactPOST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

function createJsonRequest(url: string, body: object) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/contact', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('POST creates contact submission with all fields', async () => {
    const req = createJsonRequest('http://localhost:3000/api/contact', {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '561-555-1234',
      subject: 'Test Subject',
      message: 'Test message body',
    });

    const res = await contactPOST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();

    const saved = await prisma.contactSubmission.findUnique({
      where: { id: data.id },
    });
    expect(saved).not.toBeNull();
    expect(saved?.email).toBe('john@example.com');
    expect(saved?.status).toBe('new');
  });

  it('POST creates submission without optional phone', async () => {
    const req = createJsonRequest('http://localhost:3000/api/contact', {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'No Phone',
      message: 'Test message',
    });

    const res = await contactPOST(req);
    expect(res.status).toBe(201);
  });

  it('POST returns 400 for missing required fields', async () => {
    const req = createJsonRequest('http://localhost:3000/api/contact', {
      name: 'John',
      email: 'john@example.com',
    });

    const res = await contactPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing required fields');
  });
});
