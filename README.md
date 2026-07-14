# Security System Bundle Builder

A multi-step bundle builder for configuring a home security system, built with React, TypeScript, and Tailwind CSS.

## Run Instructions

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint

# Format
pnpm format

# TypeScript type check
pnpm ts:check
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for dev server and bundling
- **Tailwind CSS 4** for styling

## Project Structure

```
src/
├── data/products.json       # Product data (JSON-driven, no hardcoded markup)
├── types/index.ts           # TypeScript interfaces
├── hooks/useBuilder.ts      # Central state management (useReducer + localStorage)
├── components/
│   ├── AccordionStep.tsx     # Single accordion step with header and product list
│   ├── ProductCard.tsx       # Product card with variant selector, stepper, pricing
│   ├── QuantityStepper.tsx   # Reusable +/- stepper component (80px card / 72px review)
│   ├── ReviewPanel.tsx       # Right-side summary panel
│		└── Price.tsx						 	# Price display component (used in product card and review panel)
└── App.tsx                   # Main layout orchestrator
public/images/                # Figma-exported icons and product images
```

## Design Decisions & Notes

- **Data-driven**: All product data (names, prices, descriptions, badges, variants, images) is defined in `src/data/products.json`. Components render from data with no per-product hardcoded markup.
- **Spacing & sizing**: Arbitrary pixel values from Figma (e.g. `15px`, `13px`, `41px`) are rounded to the nearest Tailwind standard class (4px base scale). Differences are ≤2px and visually imperceptible. This keeps the codebase consistent and maintainable. Exception: `text-[22px]` values are kept as arbitrary since no close standard exists.

## Known Limitations

- Font families use system fonts (Segoe UI) as a fallback for Gilroy, which is not freely available.
