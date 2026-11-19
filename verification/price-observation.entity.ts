export class PriceObservationEntity {
  id: string;
  productId: number;
  store: string;
  channel: string;
  region: string;
  price: number;
  observedAt: Date;
  verified: boolean;
}
