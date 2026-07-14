import { useState } from 'react';
import { useBuilder } from './hooks/useBuilder';
import { AccordionStep } from './components/AccordionStep';
import { ReviewPanel } from './components/ReviewPanel';

// TODO: Remove style fadeIn block in the end of the page
// TODO: Review page padding and spacing
// TODO: match tablet responsive
// TODO: Fix products listing responsive when products have wide variants
// TODO: Check all warnings in eslint
// TODO: Check README.md file
// TODO: Replace all arbitrary numbers with Tailwind spacing classes and colors
// TODO: Handle /mo in review and make plan unlimited word bold
// TODO: Add the line after accordion step
// TODO: Replace any style prop with Tailwind classes
// TODO: make Unlimited work in plan bold

const App = () => {
  const {
    bundleData,
    selections,
    reviewItems,
    subtotal,
    totalCompareAt,
    totalItems,
    savings,
    setQuantity,
    setActiveVariant,
    saveSystem,
    getStepSelectedCount,
    getActiveVariant,
    getStepNextLabel,
  } = useBuilder();

  const [openStep, setOpenStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const handleNext = () => {
    if (openStep < bundleData.steps.length - 1) {
      setOpenStep(openStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    alert('Checkout coming soon! Your system has been configured.');
  };

  const handleSave = () => {
    saveSystem();
    setToast('Your system has been saved!');
    setTimeout(() => setToast(null), 3000);
  };

  const activeVariants = Object.fromEntries(
    bundleData.products
      .filter((p) => p.variants && p.variants.length > 0)
      .map((p) => [p.id, getActiveVariant(p.id)]),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-300 mx-auto py-12 flex flex-col xl:flex-row gap-6">
        {/* Builder column */}
        <div className="flex-1 flex flex-col" style={{ gap: 13 }}>
          {bundleData.steps.map((step, index) => {
            const stepProducts = bundleData.products.filter((p) => step.productIds.includes(p.id));
            return (
              <AccordionStep
                key={step.id}
                step={step}
                products={stepProducts}
                isOpen={openStep === index}
                selectedCount={getStepSelectedCount(step)}
                onToggle={() => setOpenStep(openStep === index ? -1 : index)}
                onNext={handleNext}
                nextLabel={getStepNextLabel(index)}
                selections={selections}
                activeVariants={activeVariants}
                onChangeQuantity={setQuantity}
                onSelectVariant={setActiveVariant}
              />
            );
          })}
        </div>

        <ReviewPanel
          items={reviewItems}
          subtotal={subtotal}
          totalCompareAt={totalCompareAt}
          totalItems={totalItems}
          savings={savings}
          onChangeQuantity={setQuantity}
          onSave={handleSave}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-white text-sm font-medium bg-success"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
