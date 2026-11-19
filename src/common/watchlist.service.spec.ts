import { describe, expect, it } from 'vitest';
import { WatchlistService } from './watchlist.service.js';

describe('WatchlistService', () => {
  it('fires once and re-arms only when the price rises above the target again', () => {
    const service = new WatchlistService();
    const alert = { id: 'a-1', productId: 'p-1', targetPrice: 2000, triggered: false, active: true };

    const fired = service.checkPrice(alert, 1800);
    expect(fired.triggered).toBe(true);

    const rearmed = service.checkPrice(fired, 2100);
    expect(rearmed.triggered).toBe(false);
  });
});
