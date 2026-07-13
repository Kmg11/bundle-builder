type PriceVariant = 'default' | 'review' | 'summary';

type PriceVariantClasses = {
  container: string;
  price: string;
  compareAtPrice: string;
};

const priceVariantClasses: Record<PriceVariant, PriceVariantClasses> = {
  default: {
    container: 'flex-col justify-center items-end',
    price: 'text-[16px] text-price',
    compareAtPrice: 'text-[16px] text-danger',
  },
  review: {
    container: 'flex-col items-end',
    price: 'text-sm font-bold text-primary',
    compareAtPrice: 'text-sm text-gray',
  },
  summary: {
    container: 'items-baseline gap-2',
    price: 'text-2xl font-bold text-primary leading-8',
    compareAtPrice: 'text-lg text-gray',
  },
};

type PriceProps = {
  price: number;
  compareAtPrice?: number;
  variant?: PriceVariant;
  suffix?: React.ReactNode;
};

export const Price = ({ price, compareAtPrice, variant = 'default', suffix }: PriceProps) => {
  const isFree = price === 0;

  return (
    <div className={`flex ${priceVariantClasses[variant].container}`}>
      {compareAtPrice && (
        <span className={`line-through ${priceVariantClasses[variant].compareAtPrice}`}>
          ${compareAtPrice.toFixed(2)}
        </span>
      )}

      <span className={priceVariantClasses[variant].price}>
        {isFree ? 'FREE' : `$${price.toFixed(2)}`}
        {suffix}
      </span>
    </div>
  );
};
