export interface Variant {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  stepId: string;
  name: string;
  shortName: string;
  description: string;
  learnMoreUrl?: string;
  badge?: string;
  price: number;
  compareAtPrice?: number;
  variants?: Variant[];
  image: string;
  category: "cameras" | "sensors" | "accessories" | "plan";
}

export interface Step {
  id: string;
  number: number;
  title: string;
  icon: string;
  productIds: string[];
}

export type VariantQuantities = Record<string, number>;

export type Selections = Record<string, VariantQuantities>;

export interface ReviewItem {
  productId: string;
  variantId: string;
  variantName: string;
  productName: string;
  shortName: string;
  category: Product["category"];
  quantity: number;
  price: number;
  compareAtPrice?: number;
  image: string;
}

export interface BundleData {
  steps: Step[];
  products: Product[];
}
