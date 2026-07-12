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
      className="w-full"
      style={{
        backgroundColor: isOpen ? '#EDF4FF' : '#FFFFFF',
        borderRadius: isOpen ? 10 : 0,
        paddingTop: isOpen ? 15 : 5,
      }}
    >
      {/* Step label - separate from header */}
      <div style={{ padding: '0 15px' }}>
        <span
          className="text-[12px] font-medium uppercase text-[#484848] text-left block"
          style={{ letterSpacing: '0.1333em' }}
        >
          Step {step.number} of 4
        </span>
      </div>

      {/* Step header - clickable toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between cursor-pointer"
        style={{
          padding: '20px 15px',
          borderTop: '0.5px solid #1F1F1F',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
        }}
      >
        <div className="flex items-center gap-[8px]">
          <div className="w-[41px] h-[41px] rounded-[6px] flex items-center justify-center bg-[#F0F4F7] flex-shrink-0">
            <img src={stepIcons[step.icon] || ''} alt="" width={26} height={26} />
          </div>
          <h2
            className="text-[22px] font-semibold text-[#1F1F1F] leading-[1em] text-left"
            style={{ letterSpacing: '0.0273em' }}
          >
            {step.title}
          </h2>
        </div>

        <div className="flex items-center gap-[4px]">
          {isOpen && selectedCount > 0 && (
            <span className="text-[14px] font-medium text-[#4E2FD2] mr-[8px]">
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
        <div className="flex flex-col" style={{ padding: '15px 15px 20px', gap: 15 }}>
          {/* Product cards - flex layout */}
          <div className="flex flex-wrap justify-center gap-[15px]">
            {products.map((product) => {
              const productVariants = selections[product.id] || {};
              const activeVariant =
                activeVariants[product.id] || product.variants?.[0]?.id || 'default';
              const hasQty = Object.values(productVariants).some((q) => q > 0);

              return (
                <div key={product.id} className="w-full sm:w-[calc(50%-7.5px)]">
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
            <div>
              <button
                type="button"
                onClick={onNext}
                className="px-[24px] h-[39px] rounded-[7px] border text-[18px] font-semibold transition-colors cursor-pointer"
                style={{
                  borderColor: '#4E2FD2',
                  color: '#4E2FD2',
                  backgroundColor: 'transparent',
                }}
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
