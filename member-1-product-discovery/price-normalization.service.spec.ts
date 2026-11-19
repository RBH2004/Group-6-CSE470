import { describe, expect, it } from 'vitest';
import { PriceNormalizationService } from './price-normalization.service.js';

describe('PriceNormalizationService', () => {
  it('normalizes a multipack to a per-unit rate without mismatch errors', () => {
    const service = new PriceNormalizationService();
    const result = service.normalizePrice({ price: 1200, quantity: 2, unit: '500g', targetUnit: '500g' });

    expect(result.valid).toBe(true);
    expect(result.perUnit).toBe(600);
  });
});
