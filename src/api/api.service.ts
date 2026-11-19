import { Injectable } from '@nestjs/common';
import { CatalogService } from '../catalog/catalog.service.js';
import { DiscountCheckService } from '../common/discount-check.service.js';
import { BasketService, BasketItem } from '../common/basket.service.js';
import { VerificationService } from '../common/verification.service.js';
import { SubmissionService } from '../submission/submission.service.js';
import { WatchlistService } from '../common/watchlist.service.js';
import { productSeed, submissions, alerts, concerns } from '../common/seed-data.js';

@Injectable()
export class ApiService {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly discountCheckService: DiscountCheckService,
    private readonly basketService: BasketService,
    private readonly verificationService: VerificationService,
    private readonly submissionService: SubmissionService,
    private readonly watchlistService: WatchlistService,
  ) {}

  getProducts(query?: string, category?: string, brand?: string, channel?: string, verifiedOnly?: boolean) {
    return this.catalogService.getAllProducts({
      query,
      category,
      brand,
      channel,
      verifiedOnly,
    });
  }

  getProductBySlug(slug: string) {
    const product = this.catalogService.getProductBySlug(slug);
    const verifiedPrices = product.prices.filter((p) => p.verified);
    const low = verifiedPrices.length ? Math.min(...verifiedPrices.map((p) => p.price)) : 0;
    const high = verifiedPrices.length ? Math.max(...verifiedPrices.map((p) => p.price)) : 0;
    const average = product.prices.length
      ? Math.round(product.prices.reduce((sum, p) => sum + p.price, 0) / product.prices.length)
      : 0;

    return {
      product,
      low,
      high,
      average,
      priceRows: product.prices,
    };
  }

  checkDiscount(claimedOriginalPrice: number, currentPrice: number, productId?: number) {
    const targetProduct = productId ? productSeed.find((p) => p.id === productId) : productSeed[0];
    const history = (targetProduct ?? productSeed[0]).prices.map((p) => ({
      price: p.price,
      date: p.date,
      channel: p.channel,
      verified: p.verified,
    }));

    return this.discountCheckService.evaluate(Number(claimedOriginalPrice), Number(currentPrice), history);
  }

  getSubmissions() {
    return this.submissionService.listMySubmissions();
  }

  createSubmission(data: { productId: number; store: string; price: number; date?: string; channel?: string }) {
    const isDuplicate = this.submissionService.detectDuplicate(
      data.productId,
      data.store,
      data.price,
      data.date ?? new Date().toISOString(),
    );

    if (isDuplicate) {
      return {
        success: false,
        message: 'Duplicate submission rejected within the 24-hour guard window.',
      };
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      productName: productSeed.find((p) => p.id === Number(data.productId))?.name ?? 'General Product',
      store: data.store,
      price: Number(data.price),
      date: data.date ?? new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
      proofUrl: '/uploads/demo-receipt.jpg',
    };
    submissions.push(newSub as any);

    return {
      success: true,
      message: 'Price submitted successfully and queued for verification.',
      submission: newSub,
    };
  }

  getVerificationFeed() {
    return submissions.map((submission) => ({
      ...submission,
      summary: this.verificationService.summarize([
        { userId: 'u-2', trustWeight: 1.2, decision: 'confirm' },
        { userId: 'u-3', trustWeight: 1.1, decision: 'confirm' },
      ]),
    }));
  }

  voteVerification(submissionId: string, decision: 'confirm' | 'dispute') {
    const summary = this.verificationService.summarize([
      { userId: 'u-current', trustWeight: 1.4, decision: 'confirm' },
      { userId: 'u-voter', trustWeight: 1.2, decision },
    ]);

    const target = submissions.find((s) => s.id === submissionId);
    if (target) {
      target.status = summary.status as any;
    }

    return {
      success: true,
      status: summary.status,
      confirmScore: summary.confirmScore,
      thresholdReached: summary.thresholdReached,
      message: `Vote recorded as ${decision}. New status: ${summary.status}`,
    };
  }

  optimizeBasket(customItems?: BasketItem[]) {
    const defaultItems: BasketItem[] = [
      {
        id: 'item-1',
        name: 'Samsung Galaxy M34 5G',
        quantity: 1,
        offers: [
          { store: 'Daraz BD', price: 32999, deliveryFee: 120, verified: true },
          { store: 'Samsung Official', price: 33999, deliveryFee: 0, verified: true },
          { store: 'Local Retailer', price: 34500, deliveryFee: 230, verified: false },
        ],
      },
      {
        id: 'item-2',
        name: 'Basmati Rice 5kg',
        quantity: 2,
        offers: [
          { store: 'Meena Bazar', price: 780, deliveryFee: 50, verified: true },
          { store: 'Chaldal BD', price: 790, deliveryFee: 40, verified: true },
          { store: 'Shwapno Superstore', price: 775, deliveryFee: 80, verified: true },
        ],
      },
      {
        id: 'item-3',
        name: 'Pran Chips Family Pack',
        quantity: 3,
        offers: [
          { store: 'Chaldal BD', price: 120, deliveryFee: 40, verified: true },
          { store: 'Meena Bazar', price: 125, deliveryFee: 50, verified: true },
        ],
      },
    ];

    const itemsToOptimize = customItems && customItems.length > 0 ? customItems : defaultItems;
    return this.basketService.optimize(itemsToOptimize);
  }

  getWatchlist() {
    return alerts.map((a) => {
      const prod = productSeed.find((p) => p.id === Number(a.productId));
      return {
        ...a,
        productName: prod?.name ?? 'Sample Product',
        currentPrice: prod?.currentPrice ?? 0,
      };
    });
  }

  createWatchlistAlert(productId: number, targetPrice: number) {
    const newAlert = {
      id: `a-${Date.now()}`,
      productId: Number(productId),
      targetPrice: Number(targetPrice),
      triggered: false,
      active: true,
    };
    alerts.push(newAlert);
    return { success: true, alert: newAlert };
  }

  removeWatchlistAlert(id: string) {
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx >= 0) {
      alerts.splice(idx, 1);
      return { success: true, message: 'Alert removed' };
    }
    return { success: false, message: 'Alert not found' };
  }

  getConcerns() {
    return concerns;
  }

  getConcernThread(id: string) {
    const concern = concerns.find((c) => c.id === id) ?? concerns[0];
    return {
      concern,
      messages: [
        { author: 'Customer', body: concern.message, time: '2 hours ago' },
        { author: 'Brand Representative', body: 'We have received your report and cross-checked the merchant invoice. A price audit is in progress.', time: '1 hour ago' },
        { author: 'BrandTruth Moderator', body: 'Observation flagged for verification inspection.', time: '30 mins ago' },
      ],
    };
  }

  addConcern(productId: number, type: string, message: string) {
    const newConcern = {
      id: `c-${Date.now()}`,
      customerLabel: 'Verified Customer #84',
      productId: Number(productId),
      status: 'Open' as const,
      type: type || 'Misleading Discount Claim',
      message: message || 'Price observed on shelf differed from advertised discount poster.',
    };
    concerns.push(newConcern);
    return { success: true, concern: newConcern };
  }

  getReviews() {
    return productSeed.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      currentPrice: p.currentPrice,
      reviews: p.reviews,
    }));
  }

  addReview(productId: number, rating: number, comment: string, user = 'demo-student') {
    const prod = productSeed.find((p) => p.id === Number(productId));
    if (prod) {
      prod.reviews.push({
        user,
        rating: Number(rating),
        comment: comment || 'Verified purchase. Accurate price.',
      });
      return { success: true, reviews: prod.reviews };
    }
    return { success: false, message: 'Product not found' };
  }

  // --- Python Service Integration ---
  async checkPythonHealth(): Promise<any> {
    try {
      const res = await fetch('http://127.0.0.1:5001/health', { signal: AbortSignal.timeout(2000) });
      return await res.json();
    } catch {
      return { status: 'offline', message: 'Python service is not currently running on port 5001.' };
    }
  }

  async predictFakeDiscountWithPython(claimedOriginalPrice: number, currentPrice: number, history?: any[]) {
    try {
      const payload = {
        claimed_original_price: claimedOriginalPrice,
        current_price: currentPrice,
        history: history || productSeed[0].prices,
      };
      const res = await fetch('http://127.0.0.1:5001/api/predict-fake-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      return await res.json();
    } catch (e: any) {
      // Fallback to local statistical estimation if python service isn't active
      return {
        verdict: claimedOriginalPrice > currentPrice * 1.15 ? 'INFLATED_FAKE' : 'GENUINE',
        fallback: true,
        message: 'Python ML service offline, rendered via NestJS baseline rules.',
      };
    }
  }

  async scrapeStoreWithPython(store: string, query: string) {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/scrape-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store, query }),
        signal: AbortSignal.timeout(3000),
      });
      return await res.json();
    } catch {
      return {
        status: 'mock_fallback',
        query,
        target_store: store,
        results: [
          { product: `${query} (Cached)`, store, scraped_price: 31500, in_stock: true, delivery_fee: 100 },
        ],
      };
    }
  }
}
