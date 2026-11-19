import { describe, expect, it } from 'vitest';
import { DiscountCheckService } from './discount-check.service.js';

describe('DiscountCheckService', () => {
  it('classifies a discount as inflated when the claimed original is above the recent verified ceiling', () => {
    const service = new DiscountCheckService();
    const result = service.evaluate(3500, 2900, [
      { price: 2500, date: '2026-10-01', channel: 'brand website', verified: true },
      { price: 3200, date: '2026-10-14', channel: 'online marketplace', verified: true },
    ]);

    expect(result.verdict).toBe('Inflated');
    expect(result.highestVerifiedPrice).toBe(3200);
  });
});
