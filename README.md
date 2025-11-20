# Mestej Winery - E-commerce Platform

A premium e-commerce platform for Mestej Winery, built with Next.js and following clean architecture principles.

## 🏗️ Architecture

This project follows **Clean Architecture** principles for better maintainability, testability, and scalability.

### Project Structure

```
src/
├── app/                    # Next.js pages and routes
├── domain/                 # Business logic (entities, interfaces)
├── application/            # Use cases and business rules
├── infrastructure/         # External services (database, auth)
├── presentation/           # UI components and contexts
└── shared/                 # Shared resources (types, constants)
```

📖 **See detailed architecture documentation:**
- [Clean Architecture Plan](./CLEAN_ARCHITECTURE_PLAN.md)
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md)
- [Migration Guide](./MIGRATION_GUIDE.md)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Animation**: Framer Motion
- **State Management**: React Context API

## 🌟 Features

- ✅ Multi-language support (English, Swedish)
- ✅ Product catalog with filtering
- ✅ Shopping cart functionality
- ✅ Admin dashboard
- ✅ Age verification
- ✅ Responsive design
- ✅ Clean architecture implementation

## 📁 Important Directories

### `/src/app` - Pages
Next.js app router pages. **Do not modify** the fundamental route structure.

### `/src/presentation` - UI Layer
All React components, organized by:
- `common/` - Shared components (Navigation, Cart, etc.)
- `features/` - Feature-specific components
- `admin/` - Admin-only components
- `contexts/` - React contexts for state management

### `/src/infrastructure` - Services
External integrations:
- `services/database/` - Supabase database operations
- `services/auth/` - Authentication services

### `/src/shared` - Shared Resources
- `types/` - TypeScript type definitions
- `locales/` - i18n translation files
- `constants/` - Application constants

### `/docs` - Documentation
All project documentation and planning files.

## 🔧 Development

### Adding a New Feature

1. **Create component** in `/src/presentation/components/features/`
2. **Add types** in `/src/shared/types/`
3. **Add translations** in `/src/shared/locales/`
4. **Add use case** (if needed) in `/src/application/use-cases/`
5. **Create page** in `/src/app/[locale]/`

### Import Conventions

```typescript
// Components
import { Navigation } from '@/presentation/components/common';

// Types
import type { Product } from '@/shared/types';

// Services
import { fetchProducts } from '@/infrastructure/services/database/products';

// Constants
import { content } from '@/shared/constants/content';
```

### Path Aliases

The following aliases are configured:
- `@/*` - src directory
- `@/presentation/*` - presentation layer
- `@/infrastructure/*` - infrastructure layer
- `@/shared/*` - shared resources
- `@/domain/*` - domain layer
- `@/application/*` - application layer

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `./scripts/update-imports.sh` - Update import paths (if needed)

## 🌐 Internationalization

The application supports multiple languages:
- English (en)
- Swedish (sv)

Add new languages by:
1. Creating `/src/shared/locales/[lang].json`
2. Adding language config in `/src/shared/constants/content.ts`

## 🔐 Environment Variables

Required environment variables (see `env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📚 Documentation

- [Clean Architecture Plan](./CLEAN_ARCHITECTURE_PLAN.md) - Detailed architecture
- [Migration Guide](./MIGRATION_GUIDE.md) - How to adapt to new structure
- [Architecture Diagram](./ARCHITECTURE_DIAGRAM.md) - Visual representation
- [Design System](./docs/DESIGN_SYSTEM.md) - UI/UX guidelines

## 🤝 Contributing

1. Follow the clean architecture principles
2. Place files in appropriate layers
3. Use barrel exports for components
4. Add proper TypeScript types
5. Update translations for new text

## 📄 License

[Your License Here]

## 👥 Team

Built by the Mestej Winery development team.

---

**Note**: This project has been recently refactored to follow clean architecture principles. All import paths have been updated automatically. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for details.
