import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { createJsonRequest } from '@/tests/helpers/request';

vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
        retrieve: vi.fn(),
      },
    },
  },
}));

import { GET as checkoutGET, POST as checkoutPOST } from '@/app/api/checkout/route';
import { stripe } from '@/lib/stripe';

const mockCreate = vi.mocked(stripe.checkout.sessions.create);
const mockRetrieve = vi.mocked(stripe.checkout.sessions.retrieve);

describe('/api/checkout', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
    mockCreate.mockClear();
    mockRetrieve.mockClear();
  });

  it('GET returns 400 when session_id is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/checkout');
    const res = await checkoutGET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing session_id');
  });

  it('POST returns 400 for missing required fields', async () => {
    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: 'test',
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing required fields');
  });

  it('POST returns 404 for non-existent vehicle', async () => {
    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: 'nonexistent-id',
      email: 'test@example.com',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      vehicleName: 'Test Car',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test',
      phone: '561-555-1234',
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Vehicle not found');
  });

  it('POST returns 400 for invalid dates', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: vehicle.id,
      email: 'test@example.com',
      startDate: 'invalid',
      endDate: '2024-06-12',
      vehicleName: 'Test Car',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test',
      phone: '561-555-1234',
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid dates');
  });

  it('POST returns 409 when vehicle is unavailable', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    await prisma.blockedDate.create({
      data: {
        vehicleId: vehicle.id,
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-14'),
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: vehicle.id,
      email: 'test@example.com',
      startDate: '2024-06-11',
      endDate: '2024-06-13',
      vehicleName: 'Test Car',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test',
      phone: '561-555-1234',
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe('Vehicle is not available for the selected dates');
  });

  it('POST returns 400 for invalid insurance option', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: vehicle.id,
      email: 'test@example.com',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      vehicleName: 'Test Car',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test',
      phone: '561-555-1234',
      extras: JSON.stringify({ insurance: 'hacked' }),
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid insurance option');
  });

  it('POST creates Stripe session with correct URL and canonical vehicle name', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Chevrolet',
        model: 'Corvette',
        category: 'Sports Car',
        dailyRate: 34900,
        available: true,
      },
    });

    mockCreate.mockResolvedValue({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    } as any);

    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: vehicle.id,
      email: 'test@example.com',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      vehicleName: 'Hacked Vehicle Name', // Should be ignored
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test User',
      phone: '561-555-1234',
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.sessionId).toBe('cs_test_123');
    expect(data.url).toBe('https://checkout.stripe.com/test');

    // Verify Stripe was called with correct parameters
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0]![0] as any;

    // Canonical vehicle name from DB, not client input
    expect(callArgs.line_items[0].price_data.product_data.name).toBe('Car Rental — Chevrolet Corvette');

    // URL derived from request origin (not localhost fallback)
    expect(callArgs.success_url).toBe('http://localhost:3000/booking/confirmation?session_id={CHECKOUT_SESSION_ID}');
    expect(callArgs.cancel_url).toBe('http://localhost:3000/booking?vehicle=' + vehicle.id);

    // Total computed server-side: 34900 * 2 days = 69800 cents ($698)
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(69800);

    // Metadata includes booking details
    expect(callArgs.metadata.vehicleId).toBe(vehicle.id);
    expect(callArgs.metadata.email).toBe('test@example.com');
    expect(callArgs.metadata.days).toBe('2');
  });

  it('POST computes correct total with premium insurance and addons', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    mockCreate.mockResolvedValue({
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/test',
    } as any);

    const req = createJsonRequest('http://localhost:3000/api/checkout', {
      vehicleId: vehicle.id,
      email: 'test@example.com',
      startDate: '2024-06-10',
      endDate: '2024-06-14', // 4 days
      vehicleName: 'Test Car',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'Test',
      phone: '561-555-1234',
      extras: JSON.stringify({
        insurance: 'premium',
        addons: { childSeat: true, extraDriver: true },
      }),
    });

    const res = await checkoutPOST(req);
    expect(res.status).toBe(200);

    const callArgs = mockCreate.mock.calls[0]![0] as any;
    // base: 10000 * 4 = 40000
    // insurance: 3500 * 4 = 14000
    // childSeat: 2500 * 4 = 10000
    // extraDriver: 7500 * 4 = 30000
    // total: 40000 + 14000 + 10000 + 30000 = 94000
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(94000);
  });
});
