import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import { DiscountCheckService } from '../common/discount-check.service.js';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, DiscountCheckService],
})
export class CatalogModule {}
