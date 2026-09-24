import { describe, it, expect } from 'vitest';
import { fallbackVehicles, categories } from '@/lib/vehicles';

describe('fallbackVehicles', () => {
  it('contains exactly 5 vehicles', () => {
    expect(fallbackVehicles).toHaveLength(5);
  });

  it('each vehicle has required fields', () => {
    fallbackVehicles.forEach((vehicle) => {
      expect(vehicle.id).toBeDefined();
      expect(vehicle.make).toBeDefined();
      expect(vehicle.model).toBeDefined();
      expect(vehicle.category).toBeDefined();
      expect(vehicle.dailyRate).toBeGreaterThan(0);
      expect(vehicle.imageUrl).toBeDefined();
      expect(vehicle.seats).toBeGreaterThan(0);
      expect(vehicle.transmission).toBeDefined();
    });
  });

  it('all vehicles are featured and available', () => {
    fallbackVehicles.forEach((vehicle) => {
      expect(vehicle.featured).toBe(true);
      expect(vehicle.available).toBe(true);
    });
  });

  it('contains expected makes', () => {
    const makes = fallbackVehicles.map((v) => v.make);
    expect(makes).toContain('Mercedes');
    expect(makes).toContain('Porsche');
    expect(makes).toContain('Corvette');
  });
});

describe('categories', () => {
  it('contains All as first category', () => {
    expect(categories[0]).toBe('All');
  });

  it('has at least 4 categories', () => {
    expect(categories.length).toBeGreaterThanOrEqual(4);
  });
});
