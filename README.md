# 🏪 Merchant Portal Client

A modern Next.js application for managing merchant stores and promotional campaigns with installment calculation features.

## 🚀 Features

- **🔐 Authentication**: Secure admin authentication with Supabase
- **🏬 Store Management**: CRUD operations for merchant stores
- **🎁 Promo Management**: Create and manage promotional campaigns
- **💳 Installment Calculator**: Calculate installment payments with various tenors
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **🔒 Row Level Security**: Database security with Supabase RLS

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

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
   
   Edit `.env` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Supabase RLS**
   
   Follow the guide in `SUPABASE_RLS_SETUP.md` to configure Row Level Security policies.

5. **Run development server**
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
│   ├── auth/              # Authentication services
│   ├── database/          # Database operations
│   └── supabase/          # Supabase client configuration
├── utils/                  # Utility functions
└── public/                 # Static assets
```

## 🔑 Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Hooks

## 📖 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started quickly
- [Authentication Flow](./AUTH_FLOW.md) - How authentication works
- [Supabase RLS Setup](./SUPABASE_RLS_SETUP.md) - Database security setup
- [CRUD Architecture](./CRUD_REFACTOR_SUMMARY.md) - Database operations
- [Optimization Guide](./OPTIMIZATION_SUMMARY.md) - Performance optimizations

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

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Authentication required for admin operations
- ✅ Session-based authentication with auto-refresh
- ✅ Environment variables for sensitive data
- ✅ HTTPS recommended for production

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=        # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Your Supabase anon/public key
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

```bash
# Build
npm run build

# The output will be in .next folder
# Deploy .next folder to your hosting
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
- Supabase for the backend infrastructure
- shadcn for the beautiful UI components
- Vercel for hosting and deployment

## 📞 Support

For support, email apriadisalim007@gmail.com or open an issue in the repository.

---

**Built with ❤️ using Next.js and Supabase**
