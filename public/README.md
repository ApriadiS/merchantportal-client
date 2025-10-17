# 📦 Public Directory

Static assets served directly by Next.js.

## 📁 Structure

```
public/
├── font/              # Font files
│   ├── Poppins-Regular.ttf
│   ├── Poppins-Medium.ttf
│   ├── Poppins-SemiBold.ttf
│   ├── Poppins-Bold.ttf
│   └── OFL.txt       # Font license
├── icons/            # SVG icons
│   ├── dashboard-icon.svg
│   ├── store-icon.svg
│   ├── promo-icon.svg
│   └── import-icon.svg
├── akulaku-logo.png          # Main logo
├── akulakupaylater-logo.png  # PayLater logo
├── paylater.webp             # PayLater image
└── [other assets]            # Next.js default assets
```

## 🎨 Assets

### Fonts
- **Poppins** - Primary font family
- Weights: Regular (400), Medium (500), SemiBold (600), Bold (700)
- Format: TrueType Font (.ttf)
- License: Open Font License (OFL)

### Logos
- `akulaku-logo.png` - Main Akulaku logo (used in favicon, header)
- `akulakupaylater-logo.png` - PayLater branding logo

### Icons
Custom SVG icons for navigation:
- `dashboard-icon.svg` - Dashboard menu icon
- `store-icon.svg` - Store menu icon
- `promo-icon.svg` - Promo menu icon
- `import-icon.svg` - Import data icon

## 🔗 Usage

### In Components
```tsx
import Image from "next/image";

// Logo
<Image 
  src="/akulaku-logo.png" 
  alt="Akulaku" 
  width={200} 
  height={200}
/>

// Icon
<img src="/icons/dashboard-icon.svg" alt="Dashboard" />
```

### In CSS
```css
.background {
  background-image: url('/paylater.webp');
}
```

### In Metadata
```tsx
export const metadata = {
  icons: {
    icon: '/akulaku-logo.png',
  }
}
```

## 📝 Adding New Assets

1. Place file in appropriate subdirectory
2. Use descriptive names (lowercase, hyphen-separated)
3. Optimize images before adding:
   - PNG: Use TinyPNG or similar
   - SVG: Minify with SVGO
   - WebP: Convert from PNG/JPG for better compression

### Image Optimization
```bash
# Install tools
npm install -g sharp-cli svgo

# Optimize PNG
sharp input.png -o output.png

# Optimize SVG
svgo input.svg -o output.svg
```

## 🎯 Best Practices

1. **Use Next.js Image**: Always use `next/image` for images
2. **Optimize**: Compress images before adding
3. **WebP Format**: Prefer WebP for photos
4. **SVG for Icons**: Use SVG for icons and logos
5. **Descriptive Names**: Use clear, descriptive filenames
6. **Organize**: Keep files in subdirectories by type

## 📏 Image Guidelines

- **Logos**: PNG with transparency, 2x resolution
- **Icons**: SVG, viewBox="0 0 24 24"
- **Photos**: WebP or AVIF, optimized
- **Fonts**: TTF or WOFF2

## 📚 Learn More

- [Next.js Static Files](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
