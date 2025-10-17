# 🪝 Hooks Directory

Custom React hooks for reusable logic.

## 📁 Files

```
hooks/
├── useCurrency.tsx              # Currency formatting hook
├── useInstallmentCalculator.ts # Installment calculation logic
├── usePromoForm.ts             # Promo form state management
├── usePromo.tsx                # Promo data fetching
├── useStore.tsx                # Store data fetching
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
