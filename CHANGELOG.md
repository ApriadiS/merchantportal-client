# Changelog

## [2.1.0] - 2025-01-17

### 🚀 Major Changes
- **Migration to Rust API Backend**: Moved from direct Supabase queries to Rust API backend
- **Public Routes**: Store browsing and promo viewing without authentication
- **Schema Update**: Simplified field names (e.g., `title` instead of `title_promo`)
- **Composite Keys**: PromoStore uses `{promo_id}-{store_id}` format
- **JWT Middleware**: Backend validates JWT tokens with caching for performance

### ✨ New Features
- API client with automatic JWT token injection
- Public API endpoints for non-authenticated users
- Centralized API services for Promo, Store, and PromoStore
- Query filtering support (`/get-promo?store_id={id}`)
- Vercel Analytics & Speed Insights integration

### 🔧 Technical Details

**Schema Changes**:
- Promo fields: `id_promo` → `id`, `title_promo` → `title`, `admin_promo` → `admin_fee`, etc.
- PromoStore: Removed `id` field, uses composite key `{promo_id}-{store_id}`

**API Endpoints**:
- **Promo**: Use `voucher_code` for update/delete operations
- **Store**: Use `route` for update/delete operations  
- **PromoStore**: Use composite key `{promo_id}-{store_id}` format

**Public Endpoints** (No JWT required):
```
GET /get-store              - List all stores
GET /get-store/{route}      - Get store by route
GET /get-promo?store_id={id} - Get promos for store
```

**Protected Endpoints** (JWT required):
```
POST   /create-promo
PUT    /update-promo/{voucher_code}
DELETE /delete-promo/{voucher_code}
POST   /create-store
PUT    /update-store/{route}
DELETE /delete-store/{route}
POST   /create-promo-store
DELETE /delete-promo-store/{promo_id}-{store_id}
```

### 📦 Project Structure
```
services/
  ├── api/
  │   ├── client.ts       # Base API client with JWT auth
  │   ├── promos.ts       # Promo CRUD operations
  │   ├── stores.ts       # Store CRUD operations
  │   ├── promo_store.ts  # PromoStore CRUD operations
  │   └── public.ts       # Public endpoints (no auth)
  ├── database/           # [DEPRECATED] Direct Supabase
  └── supabase/           # Auth only
```

### 🔐 Security
- JWT token validation on protected routes
- Public read-only access for store browsing
- Token caching for performance (~95% cache hit rate)
- Middleware authentication with scoped read-locks

### 🎨 UI/UX
- Vercel Analytics for user insights
- Speed Insights for performance monitoring
- Responsive design improvements

### 📝 Migration Notes
- Add `NEXT_PUBLIC_API_URL` to `.env`
- Supabase credentials still required for authentication
- All database operations now go through Rust API
- Update all field references to new schema
- Public pages work without login

### 🐛 Bug Fixes
- Fixed promo-store mapping logic
- Improved error handling for API calls
- Fixed composite key operations

### ⚡ Performance
- Backend caching reduces lookup overhead to ~50-100ms
- JWT cache hit rate: ~95%
- Optimized query filtering

---

## [0.1.0] - 2024
- Initial release with direct Supabase integration
- Basic CRUD operations
- Admin authentication
- Store and promo management
