export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ComparisonDimensionData {
  connectivity: string;
  protection: string;
  batteryRuntime: string;
  audioOutput: string;
  controls: string;
  formFactor: string;
  antenna: string;
  emergency: string;
  videoVision: string;
  certifications: string;
}

export interface Product {
  id: string;
  name: string;
  shortName?: string;
  badge: string;
  image: string;
  description: string;
  inStock: boolean;
  stockStatus: StockStatus;
  stockCount?: number;
  fallbackSimilarId?: string;
  fallbackReason?: string;
  priceEstimate?: string;
  specs: { label: string; value: string }[];
  comparison: ComparisonDimensionData;
  tags: string[];
}

export interface CartItem {
  id: string;
  name: string;
  badge: string;
  image: string;
  quantity: number;
  inStock: boolean;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    icon: string;
    tags: string[];
  }[];
}

export interface QuizRecommendation {
  product: Product;
  matchScore: number;
  reasons: string[];
  alternative?: Product;
}