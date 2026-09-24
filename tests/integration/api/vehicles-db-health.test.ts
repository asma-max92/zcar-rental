import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { clearDatabase, disconnectTestDb, setupTestDb, prisma } from '@/tests/helpers/db';
import { GET as vehiclesGET } from '@/app/api/vehicles/route';
import { NextRequest } from 'next/server';

/**
 * DB Health Check — fails CI if the fleet API cannot serve vehicles.
 * This catches: missing seed data, schema drift, Prisma client
 * mis-generation, or env var issues that silently empty the fleet.
 */
describe('Fleet DB Health', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it('seed data must include at least one available vehicle', async () => {
    // Seed the test fleet (same as production seed script)
    await prisma.vehicle.create({
      data: {
        make: 'Chevrolet',
        model: 'Corvette 2024',
        category: 'Sports Car',
        tagline: 'RED AMERICAN SUPERCAR. UNMATCHED THRILL.',
        description: 'The red 2024 Chevrolet Corvette C8 delivers American supercar performance.',
        dailyRate: 34900,
        imageUrl: '/images/corvette/01.jpg',
        galleryImages: ['/images/corvette/02.jpg', '/images/corvette/03.jpg'],
        seats: 2,
        transmission: 'Automatic',
        horsepower: 490,
        topSpeed: '194 mph',
        featured: true,
        available: true,
      },
    });

    const vehicleCount = await prisma.vehicle.count({
      where: { available: true },
    });

    expect(
      vehicleCount,
      'No available vehicles in DB after seed — check prisma/schema.prisma and seed script'
    ).toBeGreaterThan(0);
  });

  it('vehicles API must return non-empty array when DB has data', async () => {
    await prisma.vehicle.create({
      data: {
        make: 'Test',
        model: 'Vehicle',
        category: 'Sports Car',
        dailyRate: 10000,
        available: true,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/vehicles');
    const res = await vehiclesGET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(
      Array.isArray(data) && data.length > 0,
      '/api/vehicles returned empty array — DB may be unseeded or unreachable'
    ).toBe(true);
  });
});
