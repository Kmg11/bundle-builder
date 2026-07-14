import { useMemo } from 'react';
import type { ReviewItem } from '../types';
import { Price } from './Price';
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
  return (
    <div className="flex items-center py-2.5 gap-3">
      <div className="w-10 h-10 rounded flex items-center justify-center shrink-0 overflow-hidden bg-white">
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

      <div className="w-16">
        <Price
          price={item.price * item.quantity}
          compareAtPrice={item.compareAtPrice ? item.compareAtPrice * item.quantity : undefined}
          variant="review"
        />
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
  const monthlyEstimate = useMemo(
    () => (subtotal > 0 ? (subtotal / 12).toFixed(2) : '0.00'),
    [subtotal],
  );

  const grouped = useMemo(
    () =>
      categoryOrder
        .map((cat) => ({
          category: cat,
          label: categoryLabels[cat],
          items: items.filter((i) => i.category === cat),
        }))
        .filter((g) => g.items.length > 0),
    [items],
  );

  return (
    <aside className="rounded-xl bg-surface w-full xl:w-[400px] shrink-0 flex flex-col md:flex-row xl:flex-col">
      <div className="flex-1">
        <header className="px-4 pt-4">
          <h3 className="hidden xl:block text-xs font-medium tracking-[0.16em] uppercase text-muted mb-6">
            Review
          </h3>

          <div className="px-1">
            <h2 className="text-[22px] font-semibold text-dark leading-tight tracking-wide">
              Your security system
            </h2>

            <p className="text-sm text-dark/75 mt-1.5 leading-snug">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>
        </header>

        <div className="px-5 space-y-4 mt-2.5">
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

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="/images/icon-shipping.svg" alt="" width={24} height={24} />
              <span className="text-sm font-medium text-dark">Fast Shipping</span>
            </div>

            <Price price={0} compareAtPrice={5.99} variant="review" />
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 border-t border-divider flex-1">
        {/* Satisfaction badge */}
        <div className="flex flex-1 flex-row md:flex-col xl:flex-row items-center md:items-stretch xl:items-center justify-between gap-3 mb-4 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-32 md:h-32 xl:w-20 xl:h-20 rounded overflow-hidden">
              <img
                src="/images/satisfaction-badge.png"
                alt="Satisfaction Guaranteed"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="hidden md:flex xl:hidden flex-col gap-2">
              <h4 className="text-md text-dark font-bold">30-day hassle-free returns</h4>

              <p className="text-md text-dark">
                If you're not totally in love with the product, we will refund you 100%.
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col md:flex-row xl:flex-col items-end md:items-center xl:items-end gap-2 justify-between">
            <div className="px-2 rounded-sm bg-primary">
              <span className="text-xs font-medium text-white">
                as low as ${monthlyEstimate}/mo
              </span>
            </div>

            <Price price={subtotal} compareAtPrice={totalCompareAt} variant="summary" />
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
    </aside>
  );
};
