type QuantityStepperProps = {
  quantity: number;
  onChange: (qty: number) => void;
  variant?: 'card' | 'review';
  max?: number;
};

const DEFAULT_MAX = 99;

export const QuantityStepper = ({
  quantity,
  onChange,
  variant = 'card',
  max = DEFAULT_MAX,
}: QuantityStepperProps) => {
  const isReview = variant === 'review';
  const isMinusDisabled = quantity <= 0;
  const isPlusDisabled = quantity >= max;

  return (
    <div
      className={`
        flex items-center rounded-sm gap-2.5 py-2.5
        ${isReview ? 'w-[72px] bg-surface' : 'w-20 bg-white'}
      `}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        className={`
          flex items-center justify-center rounded-sm transition-colors shrink-0 w-5 h-5 
          ${isReview ? 'bg-white' : 'bg-surface-alt'} 
          ${isMinusDisabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
        `}
        aria-label="Decrease quantity"
        disabled={isMinusDisabled}
      >
        <img src="/images/icon-minus.svg" alt="" width={8} height={10} />
      </button>

      <span className="flex-1 text-center text-base font-medium leading-5 text-dark min-w-3.5">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => !isPlusDisabled && onChange(quantity + 1)}
        className={`
          flex items-center justify-center rounded-sm transition-colors shrink-0 w-5 h-5 
          ${isReview ? 'bg-white' : 'bg-surface-alt'}
          ${isPlusDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label="Increase quantity"
        disabled={isPlusDisabled}
      >
        <img src="/images/icon-plus.svg" alt="" width={8} height={8} />
      </button>
    </div>
  );
};
