# 🏪 Merchant Portal Client v2.2.7

A modern Next.js application for managing merchant stores and promotional campaigns with installment calculation features.

## 🚀 Features

- **🔐 Authentication**: Secure admin authentication with Supabase (Auth only)
- **🏬 Store Management**: CRUD operations via Rust API backend
- **🎁 Promo Management**: Create and manage promotional campaigns
- **💳 Installment Calculator**: Public installment calculator (no login required)
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🌐 Public Pages**: Browse stores and promos without authentication
- **⚡ Performance**: Vercel Analytics & Speed Insights integrated
- **🦀 Rust Backend**: High-performance API with JWT authentication

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication only)
- Rust API Backend (v1.2.0)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ApriadiS/merchantportal-client.git
   cd merchantportal-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   # Supabase (Authentication only)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Rust API Backend
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
merchantportal-client/
├── app/                      # Next.js App Router pages
│   ├── [storeRoute]/        # Dynamic store route pages
│   ├── admin/               # Admin login page
│   └── admin-dashboard/     # Protected admin dashboard
├── components/              # React components
│   ├── Auth/               # Authentication components
│   ├── AdminDashboard/     # Dashboard components
│   ├── Store/              # Store management components
│   ├── Promo/              # Promo management components
│   ├── shared/             # Shared/reusable components
│   └── ui/                 # UI components (shadcn/ui)
├── hooks/                   # Custom React hooks
├── services/               # API services
│   ├── api/               # Rust API services (v1.2.0)
│   ├── auth/              # Authentication services
│   ├── database/          # [DEPRECATED] Direct Supabase
│   └── supabase/          # Supabase client (auth only)
├── utils/                  # Utility functions
└── public/                 # Static assets
```

## 🔑 Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Backend**: Rust API (Axum framework)
- **Database**: PostgreSQL (via Rust API)
- **Authentication**: Supabase Auth (JWT tokens)
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Hooks
- **Analytics**: Vercel Analytics & Speed Insights

## 📖 Architecture (v2.2.0)

### Authentication Flow
```
User → Supabase Auth → JWT Token → Rust API (validates JWT) → PostgreSQL
```

### Public vs Protected Routes

**Public Routes** (No authentication required):
- `/` - Homepage with store list
- `/{storeRoute}` - Store detail page with promo calculator

**Protected Routes** (JWT required):
- `/admin-dashboard/*` - Admin CRUD operations

### API Endpoints

**Public Endpoints** (No JWT):
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
GET    /get-promo-store?promo_id={id}
POST   /create-promo-store
DELETE /delete-promo-store/{promo_id}-{store_id}
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔐 Security

- ✅ JWT authentication for admin operations
- ✅ Public read-only access for store browsing
- ✅ Backend validates JWT tokens with caching (~95% hit rate)
- ✅ Environment variables for sensitive data
- ✅ HTTPS recommended for production
- ✅ Supabase handles authentication only

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase (Authentication only)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Rust API Backend (v1.2.0)
NEXT_PUBLIC_API_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # Production
```

## 🚀 Deployment

### Prerequisites
1. Deploy Rust API backend first
2. Get backend API URL

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy!

### Other Platforms

```bash
# Build
npm run build

# The output will be in .next folder
# Deploy .next folder to your hosting
```

## 📊 What's New in v2.2.7

### 🐛 Critical Bug Fix

**Issue #18: Type Mismatch - PromoResponse.id_promo**
- ✅ Fixed `id_promo` type from `number` to `string` (UUID)
- ✅ Synced all interfaces with backend v1.2.0
- ✅ Update promo now works correctly in production
- ✅ All UUID fields now properly typed as `string`

### 🧹 Code Quality Improvement

**Issue #19: Redundant Type Definitions**
- ✅ Reorganized type system for clarity
- ✅ `utils/interface.ts`: All interfaces (synced with backend v1.2.0)
- ✅ `types/index.ts`: Only type aliases, unions, enums
- ✅ Removed deprecated types (PromoObject, StoreObject, etc.)
- ✅ Added backward compatibility exports

### 📝 Files Modified
- `utils/interface.ts` - Reorganized interfaces, synced with backend v1.2.0
- `types/index.ts` - Cleaned up to contain only type definitions
- `BUGS_HUNTER.md` - Added Bug 10 & 11, marked as fixed

### 🔄 Breaking Changes
- None - Backward compatible via re-exports

---

## 📊 What's New in v2.2.6

### 🐛 Medium Priority Bug Fixes

**1. Stale Data After Mutation (Issue #12)**
- ✅ Replaced full page reload with optimistic updates
- ✅ PromoClient uses addPromo/updatePromo for instant UI updates
- ✅ StoreClient uses addStore/updateStore for instant UI updates
- ✅ Eliminates window.location.reload(), improves UX

**2. No Loading State Coordination (Issue #13)**
- ✅ Implicitly fixed by removing full page reloads
- ✅ Local state updates are instant, no overlapping loaders
- ✅ Each component manages loading independently

**3. Tenor Selection Modal Auto-Close (Issue #14)**
- ✅ Auto-selects and auto-closes when only 1 tenor available
- ✅ 300ms delay for smooth transition
- ✅ Reduces extra click for single tenor scenarios

### 🔄 Breaking Changes
- None - All changes backward compatible

---

## 📊 What's New in v2.2.2

### UX Improvements
- ⚡ **Seamless Link/Unlink**: No page refresh when linking/unlinking stores and promos
- ⚠️ **Warning Indicator**: Shows ⚠️ when promo-store linked but no tenors activated
- 🎯 **Available Tenors Display**: Shows available tenors (is_available=true) next to Link/Unlink buttons
- 🔄 **Real-time State Updates**: Instant UI updates after tenor selection changes
- 📱 **Mobile-Optimized Modals**: Accordion UI with scrollable sections for better mobile UX
- 🎯 **Auto-Activate Single Tenor**: Automatically activates tenor when only one is available
- 🔤 **Alphabetical Sorting**: All lists sorted alphabetically (stores by name, promos by title, tenors by number)
- 🎨 **Consistent Rounded Modals**: All modals use rounded-lg for visual consistency

### Technical Changes
- Optimized state management with Map data structures for O(1) lookups
- Added callback mechanism for parent-child component state synchronization
- Filter tenors by is_available property in TenorSelectionModal
- Removed unnecessary loading states for smoother UX
- Accordion component for collapsible sections in view modals
- Max-height constraints with scrollbars for long lists
- Automatic sorting applied in hooks and components

### Migration from v2.2.1
- No breaking changes - fully backward compatible
- Improved performance with local state updates and sorting

---

## 📊 What's New in v2.2.0

### Major Changes
- 📱 **Mobile-First UI**: Optimized for 90% mobile users with card-style layout
- 🎯 **PromoTenor Integration**: Full CRUD with backend v1.2.0 UUID-based operations
- 🔗 **Bidirectional Linking**: Promo↔Store with KA/NKA filters and tenor selection
- 🎨 **Enhanced UX**: Badge promo muncul setelah klik hitung, dropdown "REGULER"
- 💳 **Smart Calculator**: Support admin/discount types (FIX/PERCENT), interest_rate dari promo
- ⚠️ **Free Installment Warning**: Yellow alert box untuk promo dengan cicilan gratis
- 🔄 **Toast Notifications**: Undo button untuk unlink actions
- 🔐 **JWT Expiration**: Auto logout dan redirect saat token expired
- 🎭 **Store Name Styling**: Bold uppercase dengan tight tracking

### Technical Improvements
- UUID composite key parsing fix (string slicing)
- PromoStore tenor_ids support (uuid[])
- Admin/discount calculation dengan type checking
- Interest rate dari promo table (bukan subsidi)
- Mobile touch targets (16px font, larger buttons)
- Card layout dengan bg-red-400 background

### API Changes
- New endpoint: `GET /get-promo-tenor-by-store/{store_id}` (1 request vs N+1)
- PromoFormModal: Create/update dengan interest_rate, admin_promo_type, discount_type
- PromoStore: tenor_ids field untuk filter tenor per store

### Bug Fixes
- Fixed Promise.all error handling (sequential fetch)
- Fixed admin/discount type calculation (FIX vs PERCENT)
- Fixed interest rate = 0 showing wrong total interest
- Fixed hydration error (div inside p tag)
- Fixed UUID composite key parsing

### Migration from v2.1.0
- Backend must be v1.2.0 or higher
- Database schema: promo_store.tenor_ids uuid[] field
- All promo CRUD now includes interest_rate, admin_promo_type, discount_type

## 🐛 Bug Tracking

**BUGS_HUNTER.md Convention**:
- Local bug numbering: Bug 1, Bug 2, Bug 3 (sequential in BUGS_HUNTER.md)
- GitHub issue numbering: #157, #158, #159 (depends on repo's total issue count)
- After creating GitHub issue: Update BUGS_HUNTER.md with "Bug 1 → Issue #157"
- Bug numbers ≠ Issue numbers (unless it's the first issue in repo)

**Example**:
```markdown
### [ ] Bug 1: Race Condition → Issue #157
**Found**: 2025-01-19
**GitHub**: https://github.com/user/repo/issues/157
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Apriadi Salim** ([@ApriadiS](https://github.com/ApriadiS)) - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Rust community for the powerful backend tools
- Supabase for authentication infrastructure
- shadcn for the beautiful UI components
- Vercel for hosting, analytics, and deployment

## 📞 Support

For support, email apriadisalim007@gmail.com or open an issue in the repository.

**Note**: When referencing bugs in commit messages, use GitHub issue numbers (#157), not local bug numbers (Bug 1).

---

**Built with ❤️ using Next.js, Rust, and Supabase**

**Version**: 2.2.7  
**Last Updated**: January 2025
