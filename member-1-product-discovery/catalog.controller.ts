import { Body, Controller, Get, Param, Post, Query, Render, Req, Res } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';
import { DiscountCheckService } from '../common/discount-check.service.js';
import { productSeed } from '../common/seed-data.js';

@Controller()
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly discountCheckService: DiscountCheckService,
  ) {}

  @Get('/')
  @Render('home')
  homePage() {
    const products = this.catalogService.getHomeProducts();

    return {
      title: 'BrandTruth',
      products,
      trending: [productSeed[0], productSeed[2]],
      featureCards: [
        { heading: 'Compare', description: 'Track verified prices across channels in seconds.' },
        { heading: 'Verify', description: 'See whether a price is trusted and current.' },
        { heading: 'Alert', description: 'Create price-drop or target-price watchlists.' },
      ],
    };
  }

  @Get('search')
  @Render('search')
  searchPage(@Query('q') q?: string, @Query('category') category?: string, @Query('brand') brand?: string, @Query('channel') channel?: string, @Query('verifiedOnly') verifiedOnly?: string) {
    const results = this.catalogService.getAllProducts({
      query: q,
      category,
      brand,
      channel,
      verifiedOnly: verifiedOnly === '1',
    });

    return {
      title: 'Search',
      products: results,
      q,
      category,
      brand,
      channel,
      verifiedOnly,
      categories: ['Consumer Electronics', 'Packaged Groceries'],
      brands: ['Samsung', 'Canon', 'Aarong Foods', 'Pran'],
      channels: ['online marketplace', 'brand website', 'physical shop'],
    };
  }

  @Get('products/:slug')
  @Render('product')
  productPage(@Param('slug') slug: string) {
    const product = this.catalogService.getProductBySlug(slug);
    const low = Math.min(...product.prices.filter((price) => price.verified).map((price) => price.price));
    const high = Math.max(...product.prices.filter((price) => price.verified).map((price) => price.price));

    return {
      title: product.name,
      product,
      low,
      high,
      average: Math.round(product.prices.reduce((sum, price) => sum + price.price, 0) / product.prices.length),
      priceRows: product.prices,
    };
  }

  @Get('discount-checker')
  @Render('discount-checker')
  discountPage() {
    return { title: 'Fake Discount Checker' };
  }

  @Post('discount-checker')
  @Render('discount-checker')
  evaluateDiscount(@Body() body: { claimedOriginalPrice: number; currentPrice: number }, @Req() req: any) {
    const history = productSeed[0].prices.map((price) => ({
      price: price.price,
      date: price.date,
      channel: price.channel,
      verified: price.verified,
    }));

    const result = this.discountCheckService.evaluate(Number(body.claimedOriginalPrice), Number(body.currentPrice), history);
    return {
      title: 'Fake Discount Checker',
      result,
      form: { claimedOriginalPrice: body.claimedOriginalPrice, currentPrice: body.currentPrice },
    };
  }
}
