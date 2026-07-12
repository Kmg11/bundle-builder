import type { ReviewItem } from '../types';
import { QuantityStepper } from './QuantityStepper';

type ReviewPanelProps = {
  items: ReviewItem[];
  subtotal: number;
  totalCompareAt: number;
  totalItems: number;
  savings: number;
  onChangeQuantity: (productId: string, variantId: string, qty: number) => void;
  onSave: () => void;
  onCheckout: () => void;
};

const categoryOrder = ['cameras', 'sensors', 'accessories', 'plan'] as const;
const categoryLabels: Record<string, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
};

type ReviewItemRowProps = {
  item: ReviewItem;
  onChangeQuantity: (productId: string, variantId: string, qty: number) => void;
};

const ReviewItemRow = ({ item, onChangeQuantity }: ReviewItemRowProps) => {
  const isFree = item.price === 0;

  return (
    <div className="flex items-center py-2.5 gap-3">
      <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 overflow-hidden bg-white">
        <img src={item.image} alt={item.shortName} className="w-full h-full object-contain" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark">
          {item.productName}
          {item.variantName && <span className="text-gray font-normal"> ({item.variantName})</span>}
        </p>
      </div>

      <QuantityStepper
        quantity={item.quantity}
        onChange={(qty) => onChangeQuantity(item.productId, item.variantId, qty)}
        variant="review"
      />

      <div className="flex flex-col items-end">
        {item.compareAtPrice && (
          <span className="text-sm text-gray line-through">
            ${((item.compareAtPrice || item.price) * item.quantity).toFixed(2)}
          </span>
        )}

        <span className="text-sm font-semibold text-primary text-right">
          {isFree ? 'FREE' : `$${(item.price * item.quantity).toFixed(2)}`}
        </span>
      </div>
    </div>
  );
};

export const ReviewPanel = ({
  items,
  subtotal,
  totalCompareAt,
  savings,
  onChangeQuantity,
  onSave,
  onCheckout,
}: ReviewPanelProps) => {
  const monthlyEstimate = subtotal > 0 ? (subtotal / 12).toFixed(2) : '0.00';

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      items: items.filter((i) => i.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="w-full rounded-xl bg-surface">
      <header className="px-4 pt-4">
        <h3 className="text-xs font-medium tracking-[0.16em] uppercase text-muted mb-6">Review</h3>

        <div className="px-1">
          <h2 className="text-[22px] font-semibold text-dark leading-tight tracking-wide">
            Your security system
          </h2>

          <p className="text-sm text-dark/75 mt-1.5 leading-snug">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>
      </header>

      <div className="px-5 pb-4 space-y-4 mt-2.5">
        {grouped.map((group) => (
          <div key={group.category}>
            <div className="text-xs font-normal tracking-[0.03em] uppercase text-category pt-4 pb-2 border-t border-divider">
              {group.label}
            </div>

            <div className="divide-y divide-border">
              {group.items.map((item) => (
                <ReviewItemRow
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                  onChangeQuantity={onChangeQuantity}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Shipping row + satisfaction badge + checkout */}
        <div className="pt-4 border-t border-divider">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/images/icon-shipping.svg" alt="" width={24} height={24} />
              <span className="text-sm font-medium text-dark">Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray line-through">$5.99</span>
              <span className="text-sm font-bold text-primary">FREE</span>
            </div>
          </div>

          {/* Satisfaction badge */}
          <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl">
            <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
              <img
                src="/images/satisfaction-badge.png"
                alt="Satisfaction Guaranteed"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col items-end">
              <div className="px-2 rounded-sm mb-2 bg-primary">
                <span className="text-xs font-medium text-white">
                  as low as ${monthlyEstimate}/mo
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-lg text-gray line-through">${totalCompareAt.toFixed(2)}</span>
                <span className="text-2xl font-bold text-primary leading-8">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Savings message */}
          {savings > 0 && (
            <p className="text-xs font-semibold text-center text-success mb-2.5 leading-none">
              Congrats! You're saving ${savings.toFixed(2)} on your security bundle!
            </p>
          )}

          {/* Checkout button */}
          <button
            type="button"
            onClick={onCheckout}
            className="w-full py-3.5 px-4 rounded text-lg font-bold text-white bg-primary flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90"
          >
            Checkout
          </button>

          {/* Save link */}
          <button
            type="button"
            onClick={onSave}
            className="w-full text-sm italic text-center text-muted underline cursor-pointer mt-2"
          >
            Save my system for later
          </button>
        </div>
      </div>
    </aside>
  );
};
