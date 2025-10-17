# 🔧 Services Directory

API services and external integrations.

## 📁 Structure

```
services/
├── auth/              # Authentication services
│   └── index.ts      # Auth wrapper functions
├── database/         # Database operations
│   ├── stores.ts    # Store CRUD operations
│   ├── promos.ts    # Promo CRUD operations
│   └── promo_store.ts # Promo-Store mapping operations
└── supabase/         # Supabase client configuration
    ├── supabaseClient.ts  # Client-side Supabase instance
    └── supabaseServer.ts  # Server-side Supabase instance
```

## 📂 Directories

### `auth/`
Authentication service wrappers:
- `signInClient(email, password)` - Login user
- `signOutClient()` - Logout user
- `getSessionClient()` - Get current session

### `database/`
Database CRUD operations using Supabase client:

**stores.ts**
- `getAllStores()` - Fetch all stores
- `getStoreByRoutePublic(route)` - Get store by route (public)
- `createStore(payload)` - Create new store
- `updateStore(id, payload)` - Update store
- `deleteStore(id)` - Delete store
- `getStoresByIds(ids)` - Fetch multiple stores

**promos.ts**
- `getAllPromos()` - Fetch all promos
- `getPromoById(id)` - Get promo by ID
- `createPromo(payload)` - Create new promo
- `updatePromo(id, payload)` - Update promo
- `deletePromo(id)` - Delete promo

**promo_store.ts**
- `getAllPromoStores()` - Fetch all mappings
- `getPromoStoresByPromoId(promoId)` - Get stores for promo
- `getPromoStoresByStoreId(storeId)` - Get promos for store
- `addPromoToStore(payload)` - Create mapping
- `removePromoFromStore(id)` - Delete mapping

### `supabase/`
Supabase client configuration:

**supabaseClient.ts**
- Client-side Supabase instance
- Session persistence enabled
- Auto token refresh
- Used in client components

**supabaseServer.ts**
- Server-side Supabase instance
- Cookie-based session
- Auth check enforced
- Used in server components/actions

## 🔐 Authentication Flow

All database operations use `supabaseClient` which automatically:
1. Attaches auth token from localStorage
2. Sends token with every request
3. Supabase RLS validates the token
4. Returns data if authorized

```typescript
// Example usage
import { getAllStores } from "@services/database/stores";

// This automatically includes auth token
const stores = await getAllStores();
```

## 🛡️ Security

- ✅ All operations protected by Supabase RLS
- ✅ Session-based authentication
- ✅ Auto token refresh
- ✅ No credentials in code

## 🔧 Adding New Services

1. Create new file in appropriate directory
2. Import supabaseClient
3. Implement CRUD functions
4. Export functions

Example:
```typescript
// services/database/products.ts
"use client";
import { supabaseClient } from "@services/supabase/supabaseClient";

export async function getAllProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*");
  
  if (error) throw error;
  return data;
}
```

## 📚 Learn More

- [Supabase Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
