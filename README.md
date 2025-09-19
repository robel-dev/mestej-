# 🍯 Mestej Winery Website

A modern, elegant website for Mestej Winery, showcasing premium honey, buckthorn, and blueberry wines with a focus on Swedish tradition and craftsmanship.

## 🚀 Features

- **Age Verification System** - Compliant alcohol access verification
- **Multilingual Support** - English and Swedish languages
- **Premium Design** - Black and gold theme with glass morphism effects
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Works beautifully on all devices
- **Product Showcase** - Interactive wine gallery with Systembolaget integration
- **Modern Tech Stack** - Next.js 15, TypeScript, Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Fonts**: Playfair Display (serif) + Inter (sans-serif)

## 🎨 Design Features

- **Color Palette**: Black background, golden accents (#FFD700), white text
- **Glass Morphism**: Translucent UI elements with backdrop blur
- **Parallax Effects**: Mouse-tracking background elements
- **Golden Gradients**: Animated shimmer text effects
- **Custom Scrollbar**: Golden-themed scrollbar styling

## 📱 Pages

- **Home** (`/`) - Hero section, product gallery, social links
- **About** (`/about`) - Company story and mission
- **History** (`/history`) - Heritage and tradition
- **Wines** (`/wines`) - Full product showcase
- **Contact** (`/contact`) - Contact form and information
- **Login** (`/login`) - Permit holder access (placeholder)
- **Ordering** (`/ordering`) - Online ordering (coming soon)
- **Webshop** (`/webshop`) - Merchandise store

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

The project is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting provider**

## 📁 Project Structure

```
mestej-v1/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and content
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Images and static assets
├── public/                 # Static files
├── tailwind.config.js      # Tailwind CSS configuration
└── next.config.js         # Next.js configuration
```

## 🎯 Key Components

- **AgeGate** - Age verification modal
- **Navigation** - Responsive navigation with language switcher
- **HeroSection** - Animated landing section
- **ProductGallery** - Interactive wine showcase
- **Layout** - Main application wrapper with background

## 🌍 Multilingual Support

The website supports:
- 🇺🇸 **English** (default)
- 🇸🇪 **Swedish**

Language selection is persistent and stored in localStorage.

## 🍷 Product Integration

- **Systembolaget Links** - Direct links to purchase wines
- **Restaurant Availability** - Shows where wines are available
- **Interactive Cards** - Expandable product information

## 📞 Contact & Social

- **Contact Form** - Functional contact form with validation
- **Social Media** - Instagram and TikTok integration
- **Company Information** - Business details and location

## 🔧 Customization

### Colors
Modify colors in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'gold': '#FFD700',
      'warm-gold': '#F4D03F',
      'dark-gold': '#B8860B',
    }
  }
}
```

### Content
Update content in `src/lib/content.ts` for both languages.

### Background Image
Replace `/public/assets/mestej.jpeg` with your own image.

## 📝 License

© 2025 Mestej Winery. All rights reserved.

---

**Built with ❤️ for premium Swedish wine craftsmanship**
