# 🛠️ Utils Directory

Utility functions and type definitions.

## 📁 Files

```
utils/
├── format.ts      # Formatting utilities
├── interface.ts   # TypeScript interfaces
├── types.ts       # TypeScript types
└── logging.ts     # Logging utilities
```

## 📄 Files

### `format.ts`
Formatting utilities for display:

```typescript
// Currency formatting
formatCurrency(amount: number): string
// Example: formatCurrency(1000) => "Rp 1.000"

// Percentage formatting
formatPercent(value: number, decimals?: number): string
// Example: formatPercent(2.6, 2) => "2.60%"

// Admin fee formatting
formatAdmin(value: number, type: AdminPromoType): string
// Example: formatAdmin(5000, "FIX") => "Rp 5.000"
// Example: formatAdmin(5, "PERCENT") => "5%"
```

### `interface.ts`
TypeScript interfaces for data structures:

```typescript
// Store interfaces
interface StoreRequest { ... }
interface StoreResponse { ... }

// Promo interfaces
interface PromoRequest { ... }
interface PromoResponse { ... }

// Promo-Store mapping
interface PromoStoreRequest { ... }
interface PromoStoreResponse { ... }
```

### `types.ts`
TypeScript type definitions:

```typescript
// Admin promo type
type AdminPromoType = "FIX" | "PERCENT";

// Discount type
type DiscountType = "FIX" | "PERCENT";

// Store type
type StoreType = "KA" | "NKA";
```

### `logging.ts`
Logging utilities (Winston):

```typescript
// Log levels
logger.info(message, metadata)
logger.warn(message, metadata)
logger.error(message, metadata)
logger.debug(message, metadata)
```

## 🎨 Usage Examples

### Formatting
```tsx
import { formatCurrency, formatPercent } from "@/utils/format";

// In component
<p>{formatCurrency(price)}</p>
<p>{formatPercent(rate, 2)}</p>
```

### Types
```tsx
import { StoreRequest, PromoResponse } from "@/utils/interface";
import { AdminPromoType } from "@/utils/types";

const store: StoreRequest = {
  name: "Store Name",
  company: "Company",
  address: "Address",
  route: "route-slug",
  store_type: "KA"
};

const adminType: AdminPromoType = "FIX";
```

### Logging
```tsx
import logger from "@/utils/logging";

// Log info
logger.info("User logged in", { userId: 123 });

// Log error
logger.error("Failed to fetch data", { error: err.message });
```

## 🔧 Adding New Utilities

### Format Function
```typescript
// utils/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID");
}
```

### Interface
```typescript
// utils/interface.ts
export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
}

export interface ProductResponse extends ProductRequest {
  id: number;
  created_at: string;
}
```

### Type
```typescript
// utils/types.ts
export type ProductStatus = "active" | "inactive" | "draft";
```

## 📚 Best Practices

1. **Pure Functions**: Keep utilities pure (no side effects)
2. **Type Safety**: Always use TypeScript types
3. **Single Responsibility**: One function = one purpose
4. **Naming**: Use descriptive names (formatCurrency, not format)
5. **Documentation**: Add JSDoc comments for complex functions

Example:
```typescript
/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "Rp 1.000")
 */
export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
```

## 📚 Learn More

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Winston Logger](https://github.com/winstonjs/winston)
