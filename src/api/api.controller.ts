import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiService } from './api.service.js';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'BrandTruth NestJS REST API',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('products')
  getProducts(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('channel') channel?: string,
    @Query('verifiedOnly') verifiedOnly?: string,
  ) {
    return this.apiService.getProducts(q, category, brand, channel, verifiedOnly === 'true' || verifiedOnly === '1');
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.apiService.getProductBySlug(slug);
  }

  @Post('discount-check')
  checkDiscount(@Body() body: { claimedOriginalPrice: number; currentPrice: number; productId?: number }) {
    return this.apiService.checkDiscount(body.claimedOriginalPrice, body.currentPrice, body.productId);
  }

  @Get('submissions')
  getSubmissions() {
    return this.apiService.getSubmissions();
  }

  @Post('submissions')
  createSubmission(@Body() body: { productId: number; store: string; price: number; date?: string; channel?: string }) {
    return this.apiService.createSubmission(body);
  }

  @Get('verification')
  getVerificationFeed() {
    return this.apiService.getVerificationFeed();
  }

  @Post('verification/:id/vote')
  vote(@Param('id') id: string, @Body() body: { decision: 'confirm' | 'dispute' }) {
    return this.apiService.voteVerification(id, body.decision);
  }

  @Get('basket')
  getBasket() {
    return this.apiService.optimizeBasket();
  }

  @Post('basket/optimize')
  optimizeBasket(@Body() body: { items?: any[] }) {
    return this.apiService.optimizeBasket(body.items);
  }

  @Get('watchlist')
  getWatchlist() {
    return this.apiService.getWatchlist();
  }

  @Post('watchlist')
  createAlert(@Body() body: { productId: number; targetPrice: number }) {
    return this.apiService.createWatchlistAlert(Number(body.productId), Number(body.targetPrice));
  }

  @Delete('watchlist/:id')
  deleteAlert(@Param('id') id: string) {
    return this.apiService.removeWatchlistAlert(id);
  }

  @Get('concerns')
  getConcerns() {
    return this.apiService.getConcerns();
  }

  @Get('concerns/:id')
  getConcernThread(@Param('id') id: string) {
    return this.apiService.getConcernThread(id);
  }

  @Post('concerns')
  addConcern(@Body() body: { productId: number; type: string; message: string }) {
    return this.apiService.addConcern(body.productId, body.type, body.message);
  }

  @Get('reviews')
  getReviews() {
    return this.apiService.getReviews();
  }

  @Post('reviews/:productId')
  addReview(@Param('productId') productId: string, @Body() body: { rating: number; comment: string; user?: string }) {
    return this.apiService.addReview(Number(productId), body.rating, body.comment, body.user);
  }

  // --- Python AI & Scraper Endpoints ---
  @Get('python/status')
  pythonStatus() {
    return this.apiService.checkPythonHealth();
  }

  @Post('python/predict-discount')
  predictDiscount(@Body() body: { claimedOriginalPrice: number; currentPrice: number; history?: any[] }) {
    return this.apiService.predictFakeDiscountWithPython(body.claimedOriginalPrice, body.currentPrice, body.history);
  }

  @Post('python/scrape')
  scrapeStore(@Body() body: { store: string; query: string }) {
    return this.apiService.scrapeStoreWithPython(body.store || 'Daraz', body.query || 'Samsung Galaxy');
  }
}
