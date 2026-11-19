import { Controller, Get, Render } from '@nestjs/common';
import { BasketService } from '../common/basket.service.js';

@Controller()
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get('basket')
  @Render('basket')
  basketPage() {
    const items = [
      {
        id: 'item-1',
        name: 'Samsung Galaxy M34 5G',
        quantity: 1,
        offers: [
          { store: 'Daraz', price: 32999, deliveryFee: 120, verified: true },
          { store: 'Samsung Bangladesh', price: 33999, deliveryFee: 0, verified: true },
          { store: 'Local Shop', price: 34500, deliveryFee: 230, verified: false },
        ],
      },
      {
        id: 'item-2',
        name: 'Basmati Rice 5kg',
        quantity: 1,
        offers: [
          { store: 'Meena Bazar', price: 780, deliveryFee: 0, verified: true },
          { store: 'Chaldal', price: 790, deliveryFee: 40, verified: true },
        ],
      },
    ];

    return {
      title: 'Smart Basket Optimizer',
      result: this.basketService.optimize(items),
    };
  }
}
