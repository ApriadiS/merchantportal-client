# 🪝 Hooks Directory

Custom React hooks for reusable logic.

## 📁 Files

```
hooks/
├── useCurrency.tsx              # Currency formatting hook
├── useInstallmentCalculator.ts # Installment calculation logic
├── usePromoForm.ts             # Promo form state management
├── usePromo.tsx                # Promo data fetching
├── usePromoList.ts             # Promo list with sorting (A-Z)
├── usePromoFilters.ts          # Promo filtering logic
├── useStore.tsx                # Store data fetching
├── useStoreList.ts             # Store list with sorting (A-Z)
├── useStoreFilters.ts          # Store filtering logic
├── use-toast.ts                # Toast notifications (shadcn)
├── use-mobile.tsx              # Mobile detection
└── useToast-old.ts             # Legacy toast hook
```

## 🔧 Hooks

### `useCurrency(initial)`
Format numbers as Indonesian Rupiah currency.

**Returns**: `[number, formattedWithDot, formattedCurrency, setValue]`

```tsx
const [amount, withDot, currency, setAmount] = useCurrency(1000);
// amount: 1000
// withDot: "1.000"
// currency: "Rp 1.000"
```

### `useInstallmentCalculator()`
Calculate installment payments with various tenors.

**Returns**: Object with calculation state and methods

```tsx
const {
  n,                    // Principal amount
  dot,                  // Formatted amount
  results,              // Calculation results
  expanded,             // Expanded tenor
  error,                // Error message
  selectedPromoId,      // Selected promo
  calculateInstallments,
  handlePriceChange,
  setExpanded,
  setSelectedPromoId
} = useInstallmentCalculator();
```

### `usePromoForm(props)`
Manage promo form state and operations.

**Props**: `{ open, initial, onCreated, onUpdated, onClose }`

**Returns**: Form state and handlers

```tsx
const {
  title, setTitle,
  voucher, setVoucher,
  // ... other form fields
  loading,
  errors,
  handleSubmit,
  // ... store mapping state
} = usePromoForm({ open, initial, onCreated, onUpdated, onClose });
```

### `usePromo()`
Fetch and manage promo data.

```tsx
const { promos, loading, error, refetch } = usePromo();
```

### `useStore()`
Fetch and manage store data.

```tsx
const { stores, loading, error, refetch } = useStore();
```

### `useStoreList()`
Fetch stores with automatic alphabetical sorting (A-Z by name).

```tsx
const { stores, loading, error, refetch, addStore, updateStore, removeStore } = useStoreList();
// stores are automatically sorted alphabetically
```

### `usePromoList()`
Fetch promos with automatic alphabetical sorting (A-Z by title) and store count.

```tsx
const { promos, loading, error, refetch, addPromo, updatePromo, removePromo } = usePromoList();
// promos are automatically sorted alphabetically
// each promo includes storeCount property
```

### `useStoreFilters(stores)`
Filter stores by search query.

```tsx
const { q, setQ, filtered } = useStoreFilters(stores);
// filtered stores based on name, company, or route
```

### `usePromoFilters(promos)`
Filter promos by search query.

```tsx
const { q, setQ, filtered } = usePromoFilters(promos);
// filtered promos based on title or voucher code
```

### `use-toast()`
Toast notification system (shadcn/ui).

```tsx
const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed",
});
```

### `use-mobile()`
Detect mobile viewport.

```tsx
const isMobile = useMobile();
```

## 🎨 Hook Patterns

### Basic Hook
```tsx
export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  
  const doSomething = useCallback(() => {
    // logic
  }, []);
  
  return { value, setValue, doSomething };
}
```

### Data Fetching Hook
```tsx
export function useMyData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}
```

### Form Hook
```tsx
export function useMyForm(props) {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation & submission
  };
  
  return {
    field1, setField1,
    field2, setField2,
    errors,
    handleSubmit
  };
}
```

## 🔧 Creating New Hooks

1. Create new file in `hooks/`
2. Use `use` prefix for hook name
3. Export as named or default export
4. Add TypeScript types

Example:
```tsx
// hooks/useCounter.ts
import { useState, useCallback } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(c => c - 1);
  }, []);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

## 📚 Learn More

- [React Hooks](https://react.dev/reference/react)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Hook Rules](https://react.dev/reference/rules/rules-of-hooks)
