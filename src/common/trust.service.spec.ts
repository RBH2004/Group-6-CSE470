import { describe, expect, it } from 'vitest';
import { TrustService } from './trust.service.js';

describe('TrustService', () => {
  it('adds trust for a verified submission and caps at the maximum', () => {
    const service = new TrustService();

    expect(service.updateTrust(1.0, true)).toBe(1.2);
    expect(service.updateTrust(3.0, true)).toBe(3.0);
  });

  it('penalizes a rejected submission without dropping below the minimum floor', () => {
    const service = new TrustService();

    expect(service.updateTrust(0.2, false)).toBe(0.2);
    expect(service.updateTrust(1.0, false)).toBe(0.7);
  });
});
