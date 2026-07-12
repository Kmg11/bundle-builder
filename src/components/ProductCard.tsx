import type { Product } from '../types';
import { QuantityStepper } from './QuantityStepper';

type ProductCardProps = {
  product: Product;
  activeVariant: string;
  allVariantQuantities: Record<string, number>;
  isSelected: boolean;
  onChangeQuantity: (variantId: string, qty: number) => void;
  onSelectVariant: (variantId: string) => void;
};

export const ProductCard = ({
  product,
  activeVariant,
  allVariantQuantities,
  isSelected,
  onChangeQuantity,
  onSelectVariant,
}: ProductCardProps) => {
  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariantId = hasVariants ? activeVariant : 'default';
  const stepperQuantity = hasVariants
    ? allVariantQuantities[activeVariant] || 0
    : allVariantQuantities['default'] || 0;

  const mainImage = hasVariants
    ? product.variants!.find((v) => v.id === activeVariant)?.image || product.image
    : product.image;

  return (
    <div
      className="relative flex p-[11px] rounded-[10px] transition-all"
      style={{
        gap: isSelected ? 19 : 13,
        backgroundColor: '#FFFFFF',
        border: isSelected ? '2px solid rgba(78, 47, 210, 0.7)' : 'none',
      }}
    >
      {/* Image area with overlapping badge */}
      <div className="relative flex-shrink-0" style={{ width: 101, height: 137 }}>
        {product.badge && (
          <div
            className="absolute top-0 left-0 z-10 px-[6px] py-[2px] rounded-[10px] text-white text-[12px] font-semibold tracking-wide"
            style={{ backgroundColor: '#4E2FD2' }}
          >
            {product.badge}
          </div>
        )}
        <div className="w-full h-full rounded-[5px] flex items-center justify-center overflow-hidden bg-white">
          <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between" style={{ gap: 10 }}>
        <div className="flex flex-col" style={{ gap: 10 }}>
          <div>
            <h3
              className="text-[16px] font-semibold text-[#1F1F1F] leading-[1.1em]"
              style={{ letterSpacing: '0.0375em' }}
            >
              {product.name}
            </h3>
            <p
              className="text-[12px] mt-1 leading-[1.3em]"
              style={{ color: 'rgba(31,31,31,0.75)', letterSpacing: '0.05em' }}
            >
              {product.description.includes('Learn More') ? (
                product.learnMoreUrl ? (
                  <a href={product.learnMoreUrl} className="hover:opacity-80 transition-opacity">
                    {product.description.split('Learn More')[0]}
                    <span className="text-[#0000EE] underline">Learn More</span>
                  </a>
                ) : (
                  <>
                    {product.description.split('Learn More')[0]}
                    <span className="text-[#0000EE] underline">Learn More</span>
                  </>
                )
              ) : (
                product.description
              )}
            </p>
          </div>

          {/* Color variant chips */}
          {hasVariants && (
            <div className="flex items-end" style={{ gap: 6 }}>
              {product.variants!.map((v) => {
                const isActive = v.id === activeVariant;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectVariant(v.id)}
                    className="flex items-center justify-center cursor-pointer"
                    style={{
                      width: isActive ? 65 : 63,
                      height: 26,
                      padding: isActive ? '1px 3px' : '1px 5px',
                      borderRadius: 2,
                      border: isActive ? '0.5px solid #0AA288' : '0.5px solid #CCCCCC',
                      backgroundColor: isActive ? 'rgba(29, 240, 187, 0.04)' : '#FFFFFF',
                    }}
                    aria-label={`Select ${v.name}`}
                  >
                    <div className="flex items-center justify-center" style={{ gap: 4 }}>
                      <div className="rounded-[5px] overflow-hidden flex-shrink-0">
                        <img
                          src={v.image}
                          alt={v.name}
                          style={{ width: 28, height: 28, objectFit: 'contain' }}
                        />
                      </div>
                      <span
                        className="text-[10px] text-[#1F1F1F] uppercase leading-none whitespace-nowrap"
                        style={{ letterSpacing: '0.06em' }}
                      >
                        {v.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom row: stepper + pricing */}
        <div className="flex items-stretch" style={{ gap: 10 }}>
          <QuantityStepper
            quantity={stepperQuantity}
            onChange={(qty) => onChangeQuantity(currentVariantId, qty)}
          />

          {/* Price column - fills remaining width */}
          <div className="flex-1 flex flex-col justify-center items-end" style={{ gap: 3 }}>
            {product.compareAtPrice && (
              <span
                className="text-[16px] text-[#D8392B]"
                style={{
                  letterSpacing: '0.0375em',
                  textDecoration: 'line-through',
                }}
              >
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[16px] text-[#575757]" style={{ letterSpacing: '0.0375em' }}>
              ${product.price.toFixed(2)}
              {product.stepId === 'plan' && (
                <span className="text-[10px] font-normal text-[#6F7882]">/mo</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
