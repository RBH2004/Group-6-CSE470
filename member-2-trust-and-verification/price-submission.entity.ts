export class PriceSubmissionEntity {
  id: string;
  productId: number;
  store: string;
  channel: string;
  region: string;
  date: Date;
  price: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  evidenceUrl?: string;
}
