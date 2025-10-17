# 📱 App Directory

This directory contains all the pages and layouts for the application using Next.js App Router.

## 📁 Structure

```
app/
├── [storeRoute]/          # Dynamic route for store pages
│   └── page.tsx          # Store-specific installment calculator
├── admin/                # Admin authentication
│   └── page.tsx         # Login page
├── admin-dashboard/      # Protected admin area
│   ├── promo/           # Promo management
│   ├── store/           # Store management
│   ├── setting/         # Settings (placeholder)
│   ├── layout.tsx       # Dashboard layout with AuthGuard
│   └── page.tsx         # Dashboard home
├── layout.tsx           # Root layout
├── page.tsx             # Homepage
├── not-found.tsx        # 404 page
└── globals.css          # Global styles
```

## 🔒 Protected Routes

Routes under `/admin-dashboard` are protected by `AuthGuard` component:
- Requires valid Supabase session
- Auto-redirects to `/admin` if not authenticated
- Session persists across page refreshes

## 🎨 Styling

- Global styles in `globals.css`
- Tailwind CSS v4 with custom theme
- CSS variables for theming (light/dark mode ready)

## 📄 Key Files

### `layout.tsx`
Root layout with:
- Font configuration (Poppins)
- Metadata (title, description, OG tags)
- Viewport settings
- Vercel Analytics integration

### `page.tsx`
Homepage with installment calculator for public users

### `admin-dashboard/layout.tsx`
Protected layout with:
- AuthGuard wrapper
- Navigation sidebar
- Responsive design

## 🚀 Adding New Pages

1. Create new folder in `app/`
2. Add `page.tsx` for the route
3. Optional: Add `layout.tsx` for nested layout
4. For protected routes, wrap with `AuthGuard`

Example:
```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

## 📚 Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
