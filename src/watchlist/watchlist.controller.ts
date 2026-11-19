import { Body, Controller, Delete, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { alerts } from '../common/seed-data.js';
import { WatchlistService } from '../common/watchlist.service.js';

@Controller()
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get('watchlist')
  @Render('watchlist')
  watchlist() {
    return {
      title: 'Watchlist',
      alerts,
    };
  }

  @Post('watchlist')
  async createAlert(@Body() body: any, @Req() req: any, @Res() res: any) {
    const nextAlert = { id: `a-${Date.now()}`, productId: body.productId ?? '1', targetPrice: Number(body.targetPrice ?? 0), triggered: false, active: true };
    alerts.push(nextAlert);
    req.session.flash = { type: 'success', message: 'Alert created. You will be notified when the target is crossed.' };
    return res.redirect('/watchlist');
  }

  @Delete('watchlist/:id')
  removeAlert(@Param('id') id: string, @Req() req: any, @Res() res: any) {
    const index = alerts.findIndex((alert) => alert.id === id);
    if (index >= 0) {
      alerts.splice(index, 1);
      req.session.flash = { type: 'success', message: 'Alert removed.' };
    }
    return res.redirect('/watchlist');
  }
}
