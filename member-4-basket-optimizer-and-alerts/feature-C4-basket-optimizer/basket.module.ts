import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller.js';
import { BasketService } from '../common/basket.service.js';

@Module({
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
