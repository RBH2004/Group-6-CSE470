import { Body, Controller, Get, Param, Post, Render, Req, Res } from '@nestjs/common';
import { productSeed } from '../common/seed-data.js';

@Controller()
export class ReviewController {
  @Get('reviews')
  @Render('reviews')
  reviewsPage() {
    return {
      title: 'Reviews',
      products: productSeed,
    };
  }

  @Post('reviews/:productId')
  async createReview(@Param('productId') productId: string, @Body() body: { rating: number; comment: string }, @Req() req: any, @Res() res: any) {
    const product = productSeed.find((entry) => entry.id === Number(productId));
    if (product) {
      product.reviews.push({ user: 'demo-customer', rating: Number(body.rating ?? 5), comment: body.comment ?? 'Helpful review' });
    }

    req.session.flash = { type: 'success', message: 'Review submitted successfully.' };
    return res.redirect('/reviews');
  }
}
