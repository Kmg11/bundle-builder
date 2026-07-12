import { useCallback, useReducer } from 'react';
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

type Action =
  | { type: 'SET_QUANTITY'; productId: string; variantId: string; quantity: number }
  | { type: 'SET_ACTIVE_VARIANT'; productId: string; variantId: string };

interface BuilderState {
  selections: Selections;
  activeVariants: Record<string, string>;
}

function getInitialActiveVariants(selections: Selections): Record<string, string> {
  const active: Record<string, string> = {};

  for (const product of bundleData.products) {
    if (product.variants && product.variants.length > 0) {
      const saved = selections[product.id];

      if (saved) {
        const firstNonZero = Object.entries(saved).find(([, q]) => q > 0);

        active[product.id] = firstNonZero ? firstNonZero[0] : product.variants[0].id;
      } else {
        active[product.id] = product.variants[0].id;
      }
    }
  }

  return active;
}

function loadSavedState(): BuilderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const saved: Selections = JSON.parse(raw);
      return { selections: saved, activeVariants: getInitialActiveVariants(saved) };
    }
  } catch {
    // ignore
  }

  const defaultSelections = getDefaultSelections();

  return {
    selections: defaultSelections,
    activeVariants: getInitialActiveVariants(defaultSelections),
  };
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const { productId, variantId, quantity } = action;

      const newSelections = { ...state.selections };
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

      return { ...state, selections: newSelections };
    }
    case 'SET_ACTIVE_VARIANT': {
      return {
        ...state,
        activeVariants: { ...state.activeVariants, [action.productId]: action.variantId },
      };
    }
    default:
      return state;
  }
}

function getStepSelectedCount(step: Step, selections: Selections): number {
  return step.productIds.reduce((count, pid) => {
    const product = bundleData.products.find((p) => p.id === pid);
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
    image,
  };
}

/**
 * Builds a flat list of ReviewItems from the current selections.
 * Products with variants (e.g. cameras with color options) produce one item per selected variant.
 * Products without variants produce a single item keyed by 'default' if quantity > 0.
 */
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
  const [state, dispatch] = useReducer(reducer, null, loadSavedState);

  const setQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', productId, variantId, quantity: Math.max(0, quantity) });
  }, []);

  const setActiveVariant = useCallback((productId: string, variantId: string) => {
    dispatch({ type: 'SET_ACTIVE_VARIANT', productId, variantId });
  }, []);

  const saveSystem = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selections));
  }, [state.selections]);

  const reviewItems = getReviewItems(state.selections);
  const subtotal = getSubtotal(reviewItems);
  const totalCompareAt = getTotalCompareAt(reviewItems);
  const totalItems = getTotalQuantity(state.selections);
  const savings = totalCompareAt - subtotal;

  const getStepSelectedCountFn = useCallback(
    (step: Step) => getStepSelectedCount(step, state.selections),
    [state.selections],
  );

  const getActiveVariant = useCallback(
    (productId: string): string => {
      return state.activeVariants[productId] || '';
    },
    [state.activeVariants],
  );

  const getStepNextLabel = useCallback((currentStepIndex: number): string => {
    if (currentStepIndex >= bundleData.steps.length - 1) return '';
    const nextStep = bundleData.steps[currentStepIndex + 1];
    return nextStep.title;
  }, []);

  return {
    bundleData,
    selections: state.selections,
    reviewItems,
    subtotal,
    totalCompareAt,
    totalItems,
    savings,
    setQuantity,
    setActiveVariant,
    saveSystem,
    getStepSelectedCount: getStepSelectedCountFn,
    getActiveVariant,
    getStepNextLabel,
  };
}
