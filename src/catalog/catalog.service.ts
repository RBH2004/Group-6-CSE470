import { Injectable } from '@nestjs/common';
import { productSeed } from '../common/seed-data.js';

@Injectable()
export class CatalogService {
  getHomeProducts() {
    return productSeed.slice(0, 4);
  }

  getAllProducts(filter?: { category?: string; brand?: string; query?: string; verifiedOnly?: boolean; channel?: string }) {
    const query = (filter?.query ?? '').toLowerCase().trim();

    return productSeed.filter((product) => {
      const matchesQuery = !query || [product.name, product.brand, product.category].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = !filter?.category || filter.category === 'all' || product.category === filter.category;
      const matchesBrand = !filter?.brand || filter.brand === 'all' || product.brand === filter.brand;
      const matchesChannel = !filter?.channel || filter.channel === 'all' || product.channel === filter.channel;
      const matchesVerified = !filter?.verifiedOnly || product.verified;

      return matchesQuery && matchesCategory && matchesBrand && matchesChannel && matchesVerified;
    });
  }

  getProductBySlug(slug: string) {
    return productSeed.find((product) => product.slug === slug) ?? productSeed[0];
  }
}
