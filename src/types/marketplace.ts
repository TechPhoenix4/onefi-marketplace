export interface EmiPlan {
  id: string;
  tenureMonths: number;
  monthlyAmount: number;
  interestRate: number;
  processingFee: number;
  isPopular?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  additionalPrice: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  basePrice: number;
  mrp: number;
  discountPercentage: number;
  features: string[];
  variants: ProductVariant[];
  emiPlans: EmiPlan[];
}

export type ShopTab = 'top_brands' | 'nearby_stores' | 'marketplace';