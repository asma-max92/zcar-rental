import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { POST as bookingPOST } from '@/app/api/bookings/route';
import { createJsonRequest } from '@/tests/helpers/request';

describe('/api/bookings', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('POST creates a booking with valid data', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: vehicle.id,
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      pickupLocation: 'MIA Airport',
      dropoffLocation: 'MIA Airport',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '561-555-1234',
      notes: 'Test booking',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();

    const booking = await prisma.booking.findUnique({
      where: { id: data.id },
      include: { user: true },
    });
    expect(booking).not.toBeNull();
    expect(booking?.status).toBe('pending');
    expect(booking?.paymentStatus).toBe('unpaid');
    expect(booking?.totalAmount).toBe(20000);
    expect(booking?.user.email).toBe('john@example.com');
  });

  it('POST returns 400 for missing required fields', async () => {
    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: 'some-id',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Missing required fields');
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

    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: vehicle.id,
      startDate: 'invalid-date',
      endDate: '2024-06-12',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'John',
      email: 'john@example.com',
      phone: '561-555-1234',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid dates provided');
  });

  it('POST returns 400 when start date is after end date', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: vehicle.id,
      startDate: '2024-06-15',
      endDate: '2024-06-10',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'John',
      email: 'john@example.com',
      phone: '561-555-1234',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Start date must be before or equal to end date');
  });

  it('POST returns 404 for non-existent vehicle', async () => {
    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: 'nonexistent-id',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'John',
      email: 'john@example.com',
      phone: '561-555-1234',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Vehicle not found');
  });

  it('POST returns 409 for overlapping booking', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: 'existing@example.com',
        password: 'hashed',
        firstName: 'Existing',
        lastName: 'User',
      },
    });

    await prisma.booking.create({
      data: {
        userId: user.id,
        vehicleId: vehicle.id,
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-14'),
        pickupLocation: 'MIA',
        dropoffLocation: 'MIA',
        totalAmount: 40000,
        status: 'confirmed',
        paymentStatus: 'paid',
      },
    });

    const req = createJsonRequest('http://localhost:3000/api/bookings', {
      vehicleId: vehicle.id,
      startDate: '2024-06-12',
      endDate: '2024-06-16',
      pickupLocation: 'MIA',
      dropoffLocation: 'MIA',
      name: 'John',
      email: 'john@example.com',
      phone: '561-555-1234',
    });

    const res = await bookingPOST(req);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toBe('Vehicle is not available for the selected dates');
  });
});
