import { useState } from 'react';
import type { Product } from '../types';
import { Price } from './Price';
import { QuantityStepper } from './QuantityStepper';

type ProductCardProps = {
  product: Product;
  allVariantQuantities: Record<string, number>;
  isSelected: boolean;
  onChangeQuantity: (variantId: string, qty: number) => void;
};

export const ProductCard = ({
  product,
  allVariantQuantities,
  isSelected,
  onChangeQuantity,
}: ProductCardProps) => {
  const hasVariants = product.variants && product.variants.length > 0;

  const [activeVariant, setActiveVariant] = useState(() => {
    if (!hasVariants) return 'default';
    const firstWithQty = product.variants!.find((v) => (allVariantQuantities[v.id] || 0) > 0);
    return firstWithQty?.id || product.variants![0].id;
  });

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
        ${isSelected ? 'border-2 border-primary-70' : ''}
      `}
    >
      {/* Image area with overlapping badge */}
      <div className="relative shrink-0 w-full h-48 xl:w-24 xl:h-full">
        {product.badge && (
          <div className="absolute top-0 left-0 z-10 px-1.5 py-0.5 rounded-[10px] text-white text-xs font-semibold tracking-wide bg-primary">
            {product.badge}
          </div>
        )}
        <div className="w-full h-full rounded-[5px] flex items-center justify-center overflow-hidden bg-white">
          <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
        <div className="flex flex-col gap-2.5">
          <div>
            <h3 className="text-base font-semibold text-dark">{product.name}</h3>

            <p className="text-xs mt-1 text-dark/75">
              {product.description}
              {product.learnMoreUrl && (
                <>
                  {' '}
                  <a
                    href={product.learnMoreUrl}
                    className="text-link underline hover:opacity-80 transition-opacity"
                  >
                    Learn More
                  </a>
                </>
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
                    onClick={() => setActiveVariant(v.id)}
                    className={`
                      flex items-center justify-center cursor-pointer py-0.5 px-1 rounded-xs border-[0.5px] bg-white
                      ${isActive ? 'border-success bg-chip-active-bg' : 'border-chip-border'}
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
            suffix={product.priceSuffix}
          />
        </div>
      </div>
    </div>
  );
};
