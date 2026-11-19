import { Injectable } from '@nestjs/common';

export interface BasketOffer {
  store: string;
  price: number;
  deliveryFee: number;
  verified: boolean;
}

export interface BasketItem {
  id: string;
  name: string;
  quantity: number;
  offers: BasketOffer[];
}

@Injectable()
export class BasketService {
  optimize(items: BasketItem[]) {
    const missing = items.filter((item) => item.offers.every((offer) => !offer.verified)).map((item) => item.name);

    const cheapestPerItem = items.map((item) => {
      const best = item.offers.filter((offer) => offer.verified).sort((a, b) => a.price + a.deliveryFee - (b.price + b.deliveryFee))[0];
      return {
        itemId: item.id,
        itemName: item.name,
        price: best ? best.price * item.quantity + best.deliveryFee : null,
        store: best ? best.store : null,
      };
    });

    const singleStorePlan = this.findSingleStorePlan(items);
    const splitAcrossStoresPlan = this.findSplitPlan(items);

    return {
      missing,
      cheapestPerItem,
      singleStorePlan,
      splitAcrossStoresPlan,
      savings: Math.max(0, (singleStorePlan.total ?? 0) - (splitAcrossStoresPlan.total ?? 0)),
    };
  }

  private findSingleStorePlan(items: BasketItem[]) {
    const stores = new Set(items.flatMap((item) => item.offers.map((offer) => offer.store)));
    let bestTotal = Number.POSITIVE_INFINITY;
    let bestStore = 'N/A';

    for (const store of stores) {
      let total = 0;
      let isComplete = true;

      for (const item of items) {
        const offer = item.offers.find((candidate) => candidate.store === store && candidate.verified);
        if (!offer) {
          isComplete = false;
          break;
        }
        total += offer.price * item.quantity + offer.deliveryFee;
      }

      if (isComplete && total < bestTotal) {
        bestTotal = total;
        bestStore = store;
      }
    }

    return { store: bestStore, total: bestTotal === Number.POSITIVE_INFINITY ? null : Number(bestTotal.toFixed(2)) };
  }

  private findSplitPlan(items: BasketItem[]) {
    let total = 0;
    for (const item of items) {
      const preferred = item.offers.filter((offer) => offer.verified).sort((a, b) => a.price + a.deliveryFee - (b.price + b.deliveryFee))[0];
      if (!preferred) {
        return { total: null, message: `Missing verified price for ${item.name}` };
      }
      total += preferred.price * item.quantity + preferred.deliveryFee;
    }
    return { total: Number(total.toFixed(2)), message: 'Cheapest verified split plan across stores' };
  }
}
