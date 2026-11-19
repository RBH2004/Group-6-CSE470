import { Injectable } from '@nestjs/common';

export interface PriceHistoryEntry {
  price: number;
  date: string;
  channel: string;
  verified?: boolean;
}

export interface DiscountEvaluationResult {
  verdict: 'Genuine' | 'Inflated' | 'Insufficient data';
  highestVerifiedPrice: number | null;
  highestVerifiedDate: string | null;
  highestVerifiedChannel: string | null;
  message: string;
}

@Injectable()
export class DiscountCheckService {
  evaluate(
    claimedOriginalPrice: number,
    currentPrice: number,
    history: PriceHistoryEntry[],
  ): DiscountEvaluationResult {
    const verifiedHistory = history.filter((item) => item.verified !== false);

    if (verifiedHistory.length === 0) {
      return {
        verdict: 'Insufficient data',
        highestVerifiedPrice: null,
        highestVerifiedDate: null,
        highestVerifiedChannel: null,
        message: 'There are not enough verified observations in the last 30 days to judge the discount.',
      };
    }

    const highest = verifiedHistory.reduce((max, item) => (item.price > max.price ? item : max), verifiedHistory[0]);

    if (claimedOriginalPrice > highest.price) {
      return {
        verdict: 'Inflated',
        highestVerifiedPrice: highest.price,
        highestVerifiedDate: highest.date,
        highestVerifiedChannel: highest.channel,
        message: `Claimed original price ৳${claimedOriginalPrice.toLocaleString('en-BD')} is above the highest verified price of ৳${highest.price.toLocaleString('en-BD')} on ${highest.date}.`,
      };
    }

    return {
      verdict: 'Genuine',
      highestVerifiedPrice: highest.price,
      highestVerifiedDate: highest.date,
      highestVerifiedChannel: highest.channel,
      message: `Current price ৳${currentPrice.toLocaleString('en-BD')} is in line with the recent verified range.`,
    };
  }
}
