import { describe, expect, it } from 'vitest';
import { BasketService } from './basket.service.js';

describe('BasketService', () => {
  it('calculates the cheapest single-store and split-store basket totals', () => {
    const service = new BasketService();
    const result = service.optimize([
      {
        id: 'item-1',
        name: 'phone',
        quantity: 1,
        offers: [
          { store: 'Store A', price: 40000, deliveryFee: 100, verified: true },
          { store: 'Store B', price: 42000, deliveryFee: 0, verified: true },
        ],
      },
      {
        id: 'item-2',
        name: 'rice',
        quantity: 1,
        offers: [
          { store: 'Store A', price: 800, deliveryFee: 40, verified: true },
          { store: 'Store B', price: 780, deliveryFee: 50, verified: true },
        ],
      },
    ]);

    expect(result.singleStorePlan.total).toBe(40940);
    expect(result.splitAcrossStoresPlan.total).toBe(40930);
  });
});
