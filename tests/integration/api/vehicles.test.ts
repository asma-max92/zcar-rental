import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { GET as vehiclesGET } from '@/app/api/vehicles/route';
import { GET as vehicleGET } from '@/app/api/vehicles/[id]/route';
import { NextRequest } from 'next/server';

describe('/api/vehicles', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('GET returns empty array when no vehicles exist', async () => {
    const req = new NextRequest('http://localhost:3000/api/vehicles');
    const res = await vehiclesGET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('GET returns only available vehicles', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Available',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });
    await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Unavailable',
        category: 'Sports Car',
        dailyRate: 10000,
        available: false,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/vehicles');
    const res = await vehiclesGET(req);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].model).toBe('Available');
  });

  it('GET filters by category', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'SUV',
        category: 'Luxury SUV',
        dailyRate: 10000,
        available: true,
      },
    });
    await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Convertible',
        category: 'Convertible',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/vehicles?category=Convertible');
    const res = await vehiclesGET(req);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].category).toBe('Convertible');
  });
});

describe('/api/vehicles/[id]', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('GET returns vehicle by id', async () => {
    const vehicle = await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Car',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = new NextRequest(`http://localhost:3000/api/vehicles/${vehicle.id}`);
    const res = await vehicleGET(req, { params: { id: vehicle.id } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe(vehicle.id);
    expect(data.make).toBe('Test');
  });

  it('GET returns 404 for non-existent vehicle', async () => {
    const req = new NextRequest('http://localhost:3000/api/vehicles/nonexistent-id');
    const res = await vehicleGET(req, { params: { id: 'nonexistent-id' } });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Vehicle not found');
  });
});
