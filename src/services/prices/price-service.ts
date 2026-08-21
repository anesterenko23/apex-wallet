export type PriceQuote = {
  assetId: string;
  currency: string;
  price: number;
  asOf: string;
};

export interface PriceProvider {
  getPrice(assetId: string, currency: string): Promise<PriceQuote>;
}

export class PriceService {
  constructor(private readonly provider: PriceProvider) {}

  getPrice(assetId: string, currency = "USD"): Promise<PriceQuote> {
    return this.provider.getPrice(assetId, currency);
  }
}
