import { useCallback, useMemo, useReducer } from 'react';
import type {
  BundleData,
  Product,
  ReviewItem,
  Selections,
  Step,
  VariantQuantities,
} from '../types';
import productsData from '../data/products.json';

const STORAGE_KEY = 'bundle-builder-system';

const bundleData: BundleData = productsData as BundleData;
const productById = new Map(bundleData.products.map((p) => [p.id, p]));

function getDefaultSelections(): Selections {
  return {
    'wyze-cam-v4': { white: 1 },
    'wyze-cam-pan-v3': { white: 2 },
    'wyze-sense-motion-sensor': { default: 2 },
    'wyze-sense-hub': { default: 1 },
    'wyze-microsd-card': { default: 2 },
    'cam-unlimited': { default: 1 },
  };
}

type Action = {
  type: 'SET_QUANTITY';
  productId: string;
  variantId: string;
  quantity: number;
};

function loadSavedState(): Selections {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return getDefaultSelections();
}

function reducer(state: Selections, action: Action): Selections {
  const { productId, variantId, quantity } = action;

  const newSelections = { ...state };
  const productSelections: VariantQuantities = { ...newSelections[productId] };

  if (quantity <= 0) {
    delete productSelections[variantId];
  } else {
    productSelections[variantId] = quantity;
  }

  if (Object.keys(productSelections).length === 0) {
    delete newSelections[productId];
  } else {
    newSelections[productId] = productSelections;
  }

  return newSelections;
}

function getStepSelectedCount(step: Step, selections: Selections): number {
  return step.productIds.reduce((count, pid) => {
    const product = productById.get(pid);
    if (!product) return count;

    const s = selections[pid];
    if (!s) return count;

    const variants = product.variants ?? [];

    if (variants.length > 0) {
      return count + variants.filter((v) => (s[v.id] || 0) > 0).length;
    }

    return count + ((s['default'] || 0) > 0 ? 1 : 0);
  }, 0);
}

function toReviewItem(
  product: Product,
  variantId: string,
  variantName: string,
  quantity: number,
  image: string,
): ReviewItem {
  return {
    productId: product.id,
    variantId,
    variantName,
    productName: product.name,
    shortName: product.shortName,
    category: product.category,
    quantity,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    priceSuffix: product.priceSuffix,
    image,
  };
}

function getReviewItems(selections: Selections): ReviewItem[] {
  return bundleData.products.flatMap((product) => {
    const s = selections[product.id];
    if (!s) return [];

    const variants = product.variants ?? [];
    if (variants.length > 0) {
      return variants
        .filter((v) => (s[v.id] || 0) > 0)
        .map((v) => toReviewItem(product, v.id, v.name, s[v.id] || 0, v.image));
    }

    const qty = s['default'] || 0;
    return qty > 0 ? [toReviewItem(product, 'default', '', qty, product.image)] : [];
  });
}

function getSubtotal(items: ReviewItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getTotalCompareAt(items: ReviewItem[]): number {
  return items.reduce((sum, item) => {
    const cap = item.compareAtPrice || item.price;
    return sum + cap * item.quantity;
  }, 0);
}

function getTotalQuantity(selections: Selections): number {
  let total = 0;
  for (const variantQty of Object.values(selections)) {
    for (const q of Object.values(variantQty)) {
      total += q;
    }
  }
  return total;
}

export function useBuilder() {
  const [selections, dispatch] = useReducer(reducer, null, loadSavedState);

  const setQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', productId, variantId, quantity: Math.max(0, quantity) });
  }, []);

  const saveSystem = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [selections]);

  const reviewItems = useMemo(() => getReviewItems(selections), [selections]);
  const subtotal = useMemo(() => getSubtotal(reviewItems), [reviewItems]);
  const totalCompareAt = useMemo(() => getTotalCompareAt(reviewItems), [reviewItems]);
  const totalItems = useMemo(() => getTotalQuantity(selections), [selections]);
  const savings = totalCompareAt - subtotal;

  const getStepSelectedCountFn = useCallback(
    (step: Step) => getStepSelectedCount(step, selections),
    [selections],
  );

  const getStepNextLabel = useCallback((currentStepIndex: number): string => {
    if (currentStepIndex >= bundleData.steps.length - 1) return '';
    const nextStep = bundleData.steps[currentStepIndex + 1];
    return nextStep.title;
  }, []);

  return {
    bundleData,
    selections,
    reviewItems,
    subtotal,
    totalCompareAt,
    totalItems,
    savings,
    setQuantity,
    saveSystem,
    getStepSelectedCount: getStepSelectedCountFn,
    getStepNextLabel,
  };
}
