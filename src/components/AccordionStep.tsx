import type { Step, Product, Selections } from '../types';
import { ProductCard } from './ProductCard';

type AccordionStepProps = {
  step: Step;
  products: Product[];
  isOpen: boolean;
  selectedCount: number;
  onToggle: () => void;
  onNext: () => void;
  nextLabel: string;
  selections: Selections;
  activeVariants: Record<string, string>;
  onChangeQuantity: (productId: string, variantId: string, qty: number) => void;
  onSelectVariant: (productId: string, variantId: string) => void;
};

const stepIcons: Record<string, string> = {
  camera: '/images/icon-camera.svg',
  plan: '/images/icon-plan.svg',
  sensor: '/images/icon-sensors.svg',
  shield: '/images/icon-shield.svg',
};

export const AccordionStep = ({
  step,
  products,
  isOpen,
  selectedCount,
  onToggle,
  onNext,
  nextLabel,
  selections,
  activeVariants,
  onChangeQuantity,
  onSelectVariant,
}: AccordionStepProps) => {
  return (
    <div
      className={`
        w-full
        ${isOpen ? 'rounded-[10px] bg-surface' : 'bg-white'}
      `}
    >
      {/* Step label - separate from header */}
      <div className="px-4 pb-1.5">
        <span className="text-xs font-medium uppercase text-muted text-left block">
          Step {step.number} of 4
        </span>
      </div>

      {/* Step header - clickable toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full flex items-center justify-between cursor-pointer px-4 py-5 border-r-0 border-l-0 border-dark border-t-[0.5px]
          ${!isOpen ? 'border-b-[0.5px]' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-surface-alt shrink-0">
            <img src={stepIcons[step.icon] || ''} alt="" width={26} height={26} />
          </div>
          <h2 className="text-[22px] font-semibold text-dark text-left">
            {step.title}
          </h2>
        </div>

          <div className="flex items-center gap-1">
          {isOpen && selectedCount > 0 && (
            <span className="text-sm font-medium text-primary mr-2">
              {selectedCount} selected
            </span>
          )}
          <img
            src={isOpen ? '/images/icon-carrot-up.svg' : '/images/icon-carrot-down.svg'}
            alt=""
            width={12}
            height={12}
          />
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="flex flex-col gap-4 pt-4 pb-5 px-4">
          {/* Product cards - flex layout */}
          <div className="flex flex-wrap justify-center items-stretch gap-4">
            {products.map((product) => {
              const productVariants = selections[product.id] || {};
              const activeVariant =
                activeVariants[product.id] || product.variants?.[0]?.id || 'default';
              const hasQty = Object.values(productVariants).some((q) => q > 0);

              return (
                <div key={product.id} className="flex-1 min-w-70">
                  <ProductCard
                    product={product}
                    activeVariant={activeVariant}
                    allVariantQuantities={productVariants}
                    isSelected={hasQty}
                    onChangeQuantity={(variantId, qty) =>
                      onChangeQuantity(product.id, variantId, qty)
                    }
                    onSelectVariant={(variantId) => onSelectVariant(product.id, variantId)}
                  />
                </div>
              );
            })}
          </div>

          {/* Next button */}
          {nextLabel && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onNext}
                className="px-6 h-10 rounded-[7px] border text-lg font-semibold transition-colors cursor-pointer border-primary text-primary bg-transparent"
              >
                Next: {nextLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
