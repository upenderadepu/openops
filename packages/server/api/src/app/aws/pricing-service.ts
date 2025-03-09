import { Filter } from '@aws-sdk/client-pricing';
import { getPriceList, SupportedPricingRegion } from '@openops/common';
import { AppSystemProp, system } from '@openops/server-shared';
import LRUCache from 'lru-cache';

const cache = new LRUCache({ max: 500, ttl: 1000 * 60 * 60 * 24 });

export async function getPrice(
  serviceCode: string,
  filters: Filter[],
  region: SupportedPricingRegion,
): Promise<unknown> {
  const cacheKey = createCacheKey(serviceCode, filters);
  let priceList = cache.get(cacheKey);
  if (!priceList) {
    const credentials = getCredentials();
    priceList = await getPriceList(credentials, region, serviceCode, filters);
    cache.set(cacheKey, priceList);
  }

  return priceList;
}

function getCredentials(): { accessKeyId: string; secretAccessKey: string } {
  return {
    accessKeyId: system.getOrThrow(AppSystemProp.AWS_PRICING_ACCESS_KEY_ID),
    secretAccessKey: system.getOrThrow(
      AppSystemProp.AWS_PRICING_SECRET_ACCESS_KEY,
    ),
  };
}

function createCacheKey(serviceCode: string, filters: Filter[]): string {
  let cacheKey = `${serviceCode}`;

  filters.map((filter) => {
    cacheKey += `-${filter.Value}`;
  });

  return cacheKey;
}
