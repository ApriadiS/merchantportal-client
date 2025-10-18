# 📡 API Services (v2.2.0)

Centralized API services untuk komunikasi dengan Rust backend.

## 📁 Structure

```
services/api/
├── client.ts        # Base API client dengan JWT auth
├── promos.ts        # Promo CRUD operations
├── stores.ts        # Store CRUD operations
├── promo_store.ts   # PromoStore CRUD operations
├── promo_tenor.ts   # PromoTenor CRUD operations
└── public.ts        # Public endpoints (no auth)
```

## 🔐 Authentication

Semua request otomatis include JWT token dari Supabase session:

```typescript
Authorization: Bearer <jwt_token>
```

## 📦 Usage Examples

### Promo Operations

```typescript
import {
   getAllPromos,
   getPromoByVoucher,
   createPromo,
   updatePromo,
   deletePromo
} from "@/services/api/promos";

// Get all promos
const promos = await getAllPromos();

// Get by voucher code
const promo = await getPromoByVoucher("DISKON50");

// Create new promo
const newPromo = await createPromo({
   voucher_code: "DISKON50",
   title: "Diskon 50%",
   is_active: true,
   // ... other fields
});

// Update promo (by voucher_code)
const updated = await updatePromo("DISKON50", {
   title: "Diskon 50% Updated"
});

// Delete promo (by voucher_code)
await deletePromo("DISKON50");
```

### Store Operations

```typescript
import {
   getAllStores,
   getStoreByRoute,
   createStore,
   updateStore,
   deleteStore
} from "@/services/api/stores";

// Get all stores
const stores = await getAllStores();

// Get by route
const store = await getStoreByRoute("toko-elektronik-jakarta");

// Create new store
const newStore = await createStore({
   name: "Toko Elektronik Jakarta",
   route: "toko-elektronik-jakarta",
   company: "PT. Elektronik",
   // ... other fields
});

// Update store (by route)
const updated = await updateStore("toko-elektronik-jakarta", {
   name: "Toko Elektronik Jakarta Updated"
});

// Delete store (by route)
await deleteStore("toko-elektronik-jakarta");
```

### PromoStore Operations

```typescript
import {
   getAllPromoStores,
   getPromoStoreById,
   createPromoStore,
   updatePromoStore,
   deletePromoStore
} from "@/services/api/promo_store";

// Get all promo-store relations
const promoStores = await getAllPromoStores();

// Get by id
const promoStore = await getPromoStoreById(123);

// Create new relation
const newRelation = await createPromoStore({
   promo_id: 456,
   store_id: 789
});

// Update relation (by id)
const updated = await updatePromoStore(123, {
   promo_id: 999
});

// Delete relation (by id)
await deletePromoStore(123);
```

## 🔑 Schema Changes (v2.2.0)

### UUID Migration
- All primary keys migrated to UUID
- Composite keys use string slicing (not split)
- Format: `{uuid1}-{uuid2}` (73 chars total)

### Promo Fields
- Backend uses exact Supabase field names
- `id_promo`, `title_promo`, `admin_promo_type`, etc.
- `interest_rate` stored in promo table (not promo_tenor)
- `admin_promo_type` and `discount_type`: FIX or PERCENT

### PromoStore Changes
- Has `id` field (UUID)
- Composite key for operations: `{promo_id}-{store_id}`
- New field: `tenor_ids` (uuid[]) for tenor selection
- Endpoints: `/get-promo-store/{promo_id}-{store_id}`

### PromoTenor (New)
- Normalized from JSON to separate table
- Full CRUD operations
- Fields: tenor, min_transaction, admin, discount, voucher_code, etc.

### Unique Keys
| Table | Key for Update/Delete |
|-------|----------------------|
| Promo | `id_promo` (UUID) |
| Store | `route` (string) |
| PromoStore | `{promo_id}-{store_id}` (composite) |
| PromoTenor | `id` (UUID) |

## ⚡ Performance

- **JWT Caching**: ~95% cache hit rate
- **Lookup Overhead**: ~50-100ms (cache miss)
- **Direct Operations**: ~20-50ms (PromoStore)

## 🛠️ Error Handling

```typescript
try {
   const promos = await getAllPromos();
} catch (error) {
   console.error("API Error:", error.message);
   // Handle error
}
```

## 🔧 Configuration

Set API URL in `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📝 Notes

- All functions are async
- JWT token automatically injected
- Errors thrown as `Error` objects
- TypeScript types from `@/utils/interface`
