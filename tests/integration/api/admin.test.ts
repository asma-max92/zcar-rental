import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { createJsonRequest } from '@/tests/helpers/request';

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth/next';
import { GET as adminBookingsGET } from '@/app/api/admin/bookings/route';
import { GET as adminContactsGET } from '@/app/api/admin/contacts/route';
import { POST as adminVehiclesPOST } from '@/app/api/admin/vehicles/route';
import { PATCH as adminBookingPatch } from '@/app/api/admin/bookings/[id]/route';

const mockedGetServerSession = vi.mocked(getServerSession);

describe('Admin API Routes — Authorization', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    mockedGetServerSession.mockClear();
  });

  describe('GET /api/admin/bookings', () => {
    it('returns 403 for non-admin users', async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: 'user1', email: 'user@test.com', role: 'customer' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/admin/bookings');
      const res = await adminBookingsGET(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('returns 403 for unauthenticated requests', async () => {
      mockedGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/admin/bookings');
      const res = await adminBookingsGET(req);
      expect(res.status).toBe(403);
    });

    it('returns 200 for admin users', async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: 'admin1', email: 'admin@test.com', role: 'admin' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/admin/bookings');
      const res = await adminBookingsGET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.bookings).toBeDefined();
      expect(data.total).toBe(0);
    });
  });

  describe('GET /api/admin/contacts', () => {
    it('returns 403 for non-admin users', async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: 'user1', email: 'user@test.com', role: 'customer' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = new NextRequest('http://localhost:3000/api/admin/contacts');
      const res = await adminContactsGET(req);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/vehicles', () => {
    it('returns 403 for non-admin users', async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: 'user1', email: 'user@test.com', role: 'customer' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = createJsonRequest('http://localhost:3000/api/admin/vehicles', {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
      });

      const res = await adminVehiclesPOST(req);
      expect(res.status).toBe(403);
    });

    it('creates vehicle for admin users', async () => {
      mockedGetServerSession.mockResolvedValue({
        user: { id: 'admin1', email: 'admin@test.com', role: 'admin' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = createJsonRequest('http://localhost:3000/api/admin/vehicles', {
        make: 'BMW',
        model: 'M4',
        category: 'Sports Car',
        dailyRate: 25000,
        seats: 4,
        transmission: 'Automatic',
      });

      const res = await adminVehiclesPOST(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.make).toBe('BMW');
      expect(data.model).toBe('M4');
    });
  });

  describe('PATCH /api/admin/bookings/[id]', () => {
    it('returns 403 for non-admin users', async () => {
      const user = await prisma.user.create({
        data: { email: 'user@test.com', password: 'hashed', firstName: 'User', lastName: 'Test' },
      });
      const vehicle = await prisma.vehicle.create({
        data: { make: 'Test', model: 'Car', category: 'Sports Car', dailyRate: 10000 },
      });
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          vehicleId: vehicle.id,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
          pickupLocation: 'MIA',
          dropoffLocation: 'MIA',
          totalAmount: 10000,
          status: 'pending',
          paymentStatus: 'unpaid',
        },
      });

      mockedGetServerSession.mockResolvedValue({
        user: { id: 'user1', email: 'user@test.com', role: 'customer' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = createJsonRequest(
        `http://localhost:3000/api/admin/bookings/${booking.id}`,
        { status: 'confirmed' },
        'PATCH'
      );

      const res = await adminBookingPatch(req, { params: { id: booking.id } });
      expect(res.status).toBe(403);
    });

    it('updates booking for admin users', async () => {
      const user = await prisma.user.create({
        data: { email: 'user@test.com', password: 'hashed', firstName: 'User', lastName: 'Test' },
      });
      const vehicle = await prisma.vehicle.create({
        data: { make: 'Test', model: 'Car', category: 'Sports Car', dailyRate: 10000 },
      });
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          vehicleId: vehicle.id,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
          pickupLocation: 'MIA',
          dropoffLocation: 'MIA',
          totalAmount: 10000,
          status: 'pending',
          paymentStatus: 'unpaid',
        },
      });

      mockedGetServerSession.mockResolvedValue({
        user: { id: 'admin1', email: 'admin@test.com', role: 'admin' },
        expires: new Date(Date.now() + 86400000).toISOString(),
      });

      const req = createJsonRequest(
        `http://localhost:3000/api/admin/bookings/${booking.id}`,
        { status: 'confirmed' },
        'PATCH'
      );

      const res = await adminBookingPatch(req, { params: { id: booking.id } });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.status).toBe('confirmed');
    });
  });
});
