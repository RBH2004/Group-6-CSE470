import { Injectable } from '@nestjs/common';
import { submissions } from '../common/seed-data.js';

@Injectable()
export class SubmissionService {
  listMySubmissions() {
    return submissions;
  }

  detectDuplicate(productId: number, store: string, price: number, date: string) {
    return submissions.some((entry) => entry.productId === productId && entry.store === store && entry.price === price && Date.parse(entry.date) >= Date.parse(date) - 24 * 60 * 60 * 1000);
  }
}
