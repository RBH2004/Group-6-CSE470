import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller.js';
import { WatchlistService } from '../common/watchlist.service.js';

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
