import { Injectable } from '@nestjs/common';

export interface WatchlistAlert {
  id: string;
  productId: string;
  targetPrice?: number;
  percentageDrop?: number;
  triggered: boolean;
  active: boolean;
  lastTriggeredAt?: string;
}

@Injectable()
export class WatchlistService {
  checkPrice(alert: WatchlistAlert, currentPrice: number): WatchlistAlert {
    if (!alert.active) {
      return alert;
    }

    const shouldTrigger =
      (alert.targetPrice !== undefined && currentPrice <= alert.targetPrice) ||
      (alert.percentageDrop !== undefined && currentPrice <= alert.targetPrice! * (1 - alert.percentageDrop / 100));

    if (shouldTrigger && !alert.triggered) {
      return { ...alert, triggered: true, lastTriggeredAt: new Date().toISOString() };
    }

    if (alert.triggered && alert.targetPrice !== undefined && currentPrice > alert.targetPrice) {
      return { ...alert, triggered: false, lastTriggeredAt: alert.lastTriggeredAt };
    }

    return alert;
  }
}
