import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ApiModule } from './api/api.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BasketModule } from './basket/basket.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
import { ConcernModule } from './concern/concern.module.js';
import { PriceNormalizationService } from './common/price-normalization.service.js';
import { TrustService } from './common/trust.service.js';
import { ModerationModule } from './moderation/moderation.module.js';
import { ReviewModule } from './review/review.module.js';
import { SubmissionModule } from './submission/submission.module.js';
import { VerificationModule } from './verification/verification.module.js';
import { WatchlistModule } from './watchlist/watchlist.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE ?? 'sqlite') === 'mysql' ? 'mysql' : 'better-sqlite3',
      database: process.env.DB_NAME ?? 'brandtruth.sqlite',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ApiModule,
    AuthModule,
    CatalogModule,
    SubmissionModule,
    VerificationModule,
    WatchlistModule,
    ConcernModule,
    ReviewModule,
    BasketModule,
    ModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PriceNormalizationService, TrustService],
})
export class AppModule {}
