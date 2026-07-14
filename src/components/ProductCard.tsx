import type { Product } from '../types';
import { Price } from './Price';
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
      className={`
        relative flex flex-col xl:flex-row h-full p-2.5 rounded-[10px] transition-all bg-white gap-3.5
      `}
      style={{
        border: isSelected ? '2px solid rgba(78, 47, 210, 0.7)' : 'none',
      }}
    >
      {/* Image area with overlapping badge */}
      <div className="relative shrink-0 w-full h-48 xl:w-24 xl:h-full">
        {product.badge && (
          <div className="absolute top-0 left-0 z-10 px-[6px] py-[2px] rounded-[10px] text-white text-[12px] font-semibold tracking-wide bg-primary">
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
              className="text-[16px] font-semibold text-dark leading-[1.1em]"
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
                    <span className="text-link underline">Learn More</span>
                  </a>
                ) : (
                  <>
                    {product.description.split('Learn More')[0]}
                    <span className="text-link underline">Learn More</span>
                  </>
                )
              ) : (
                product.description
              )}
            </p>
          </div>

          {/* Color variant chips */}
          {hasVariants && (
            <div className="flex gap-1.5">
              {product.variants!.map((v) => {
                const isActive = v.id === activeVariant;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectVariant(v.id)}
                    className={`
                      flex items-center justify-center cursor-pointer py-0.5 px-1 rounded-xs border-[0.5px] bg-white
                      ${isActive ? 'border-success bg-primary-light' : 'border-chip-border'}
                    `}
                    aria-label={`Select ${v.name}`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-7 h-7 overflow-hidden shrink-0">
                        <img src={v.image} alt={v.name} className="w-full h-full object-contain" />
                      </div>

                      <span className="text-[10px] text-dark uppercase leading-none whitespace-nowrap">
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
        <div className="flex items-center justify-between gap-2.5">
          <QuantityStepper
            quantity={stepperQuantity}
            onChange={(qty) => onChangeQuantity(currentVariantId, qty)}
          />

          {/* Price column - fills remaining width */}
          <Price
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            suffix={
              product.stepId === 'plan' && (
                <span className="text-[10px] font-normal text-price">/mo</span>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
