import { describe, it, expect } from 'vitest';
import { cn, formatPrice, formatDate } from '@/lib/utils';

describe('cn', () => {
  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'block')).toBe('base block');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats cents to dollar string', () => {
    expect(formatPrice(44900)).toBe('$449');
    expect(formatPrice(100)).toBe('$1');
    expect(formatPrice(0)).toBe('$0');
  });

  it('handles large numbers', () => {
    expect(formatPrice(100000)).toBe('$1000');
  });
});

describe('formatDate', () => {
  it('formats Date object to locale string', () => {
    // Use noon UTC to avoid timezone boundary issues
    const date = new Date('2024-06-15T12:00:00Z');
    expect(formatDate(date)).toMatch(/Jun/);
    expect(formatDate(date)).toMatch(/2024/);
  });

  it('formats string date to locale string', () => {
    // Use noon UTC to avoid timezone boundary issues
    expect(formatDate('2024-12-25T12:00:00Z')).toMatch(/Dec/);
    expect(formatDate('2024-12-25T12:00:00Z')).toMatch(/2024/);
  });
});
