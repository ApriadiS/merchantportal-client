# 🏪 Merchant Portal Client v2.1.0

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
- Rust API Backend (v2.1.0)

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
│   ├── api/               # Rust API services (v2.1.0)
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

## 📖 Architecture (v2.1.0)

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

# Rust API Backend (v2.1.0)
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

## 📊 What's New in v2.1.0

### Major Changes
- 🦀 **Rust API Backend**: Migrated from direct Supabase to Rust API
- 🌐 **Public Routes**: Store browsing without authentication
- 🔑 **JWT Authentication**: Backend validates tokens with caching
- 📊 **New Schema**: Simplified field names (e.g., `title` instead of `title_promo`)
- 🔗 **Composite Keys**: PromoStore uses `{promo_id}-{store_id}` format
- ⚡ **Performance**: Vercel Analytics & Speed Insights

### Breaking Changes
- Supabase now only handles authentication (no direct DB queries)
- All CRUD operations go through Rust API
- Field names updated in Promo schema
- PromoStore no longer has `id` field (composite key)

### Migration Notes
- `services/database/*` is deprecated
- Use `services/api/*` for all operations
- Public pages work without login
- Admin pages require JWT token

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

---

**Built with ❤️ using Next.js, Rust, and Supabase**

**Version**: 2.1.0  
**Last Updated**: January 2025
