import { Module } from '@nestjs/common';
import { ApiController } from './api.controller.js';
import { ApiService } from './api.service.js';
import { CatalogModule } from '../catalog/catalog.module.js';
import { SubmissionModule } from '../submission/submission.module.js';
import { VerificationModule } from '../verification/verification.module.js';
import { WatchlistModule } from '../watchlist/watchlist.module.js';
import { BasketModule } from '../basket/basket.module.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { SubmissionService } from '../submission/submission.service.js';
import { DiscountCheckService } from '../common/discount-check.service.js';
import { BasketService } from '../common/basket.service.js';
import { VerificationService } from '../common/verification.service.js';
import { WatchlistService } from '../common/watchlist.service.js';
import { PriceNormalizationService } from '../common/price-normalization.service.js';
import { TrustService } from '../common/trust.service.js';

@Module({
  imports: [CatalogModule, SubmissionModule, VerificationModule, WatchlistModule, BasketModule],
  controllers: [ApiController],
  providers: [
    ApiService,
    CatalogService,
    SubmissionService,
    DiscountCheckService,
    BasketService,
    VerificationService,
    WatchlistService,
    PriceNormalizationService,
    TrustService,
  ],
  exports: [ApiService],
})
export class ApiModule {}
