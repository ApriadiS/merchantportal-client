# 🧩 Components Directory

Reusable React components organized by feature and purpose.

## 📁 Structure

```
components/
├── Auth/                 # Authentication components
├── AdminDashboard/       # Dashboard-specific components
├── Store/               # Store management components
├── Promo/               # Promo management components
├── icon/                # Custom icon components
├── shared/              # Shared/reusable components
├── ui/                  # Base UI components (shadcn/ui)
└── [feature].tsx        # Feature-specific components
```

## 📂 Directories

### `Auth/`
Authentication-related components:
- `AuthGuard.tsx` - Protected route wrapper
- `LoginClient.tsx` - Login form
- `DashboardClient.tsx` - Dashboard auth handler

### `AdminDashboard/`
Dashboard components:
- `NavBar.tsx` - Sidebar navigation with logout

### `Store/`
Store management:
- `StoreFormModal.tsx` - Create/edit store modal (rounded-lg)
- `StoreViewModal.tsx` - View store details with accordion
- `PromoLinkingModal.tsx` - Link promos to store (seamless, sorted)
- `TenorSelectionModal.tsx` - Select tenors for promo-store
- `Item.tsx` - Store list item

### `Promo/`
Promo management:
- `PromoFormModal.tsx` - Create/edit promo modal (rounded-lg)
- `PromoViewModal.tsx` - View promo details with accordion
- `StoreLinkingModal.tsx` - Link stores to promo (seamless, sorted)
- `PromoStoreMapping.tsx` - Assign stores to promos
- `PromoFormFields.tsx` - Form field components
- `PromoBasicForm.tsx` - Basic promo form
- `PromoTenorForm.tsx` - Tenor form
- `TenorManagementModal.tsx` - Manage promo tenors
- `Item.tsx` - Promo list item

### `icon/`
Custom SVG icon components:
- `DashboardIcon.tsx`
- `StoreIcon.tsx`
- `PromoIcon.tsx`
- `ImportIcon.tsx`

### `shared/`
Reusable components:
- `Loading.tsx` - Loading spinner
- `Spinner.tsx` - Simple spinner
- `ModalDelete.tsx` - Delete confirmation modal
- `ModalView.tsx` - Generic view modal
- `CloseButton.tsx` - Modal close button
- `CRUDComponent.tsx` - Generic CRUD wrapper

### `ui/`
Base UI components from shadcn/ui:
- Form elements (button, input, select, etc.)
- Layout components (card, dialog, sheet, etc.)
- Feedback components (toast, alert, etc.)
- Navigation components (tabs, accordion, etc.)

## 🎨 Component Patterns

### Client Components
Most components use `"use client"` directive for interactivity:
```tsx
"use client";
import { useState } from "react";

export default function MyComponent() {
  const [state, setState] = useState();
  // ...
}
```

### Modal Components
Follow consistent pattern:
```tsx
interface Props {
  open: boolean;
  onClose: () => void;
  // ... other props
}

export default function MyModal({ open, onClose }: Props) {
  if (!open) return null;
  // ...
}
```

### Form Components
Use React Hook Form + Zod:
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  // validation schema
});

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  });
  // ...
}
```

## 🔧 Adding New Components

1. Create component file in appropriate directory
2. Use TypeScript for type safety
3. Add `"use client"` if component needs interactivity
4. Export as default
5. Document props with TypeScript interfaces

Example:
```tsx
// components/MyFeature/MyComponent.tsx
"use client";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

## 📚 Learn More

- [React Components](https://react.dev/learn/your-first-component)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
