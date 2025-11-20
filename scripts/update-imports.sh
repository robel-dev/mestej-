#!/bin/bash

# Import Path Update Script
# This script helps update import paths after clean architecture refactoring

echo "🔧 Updating import paths for Clean Architecture..."
echo ""

# Function to update imports in a file
update_imports() {
    local file=$1
    echo "  Processing: $file"
    
    # Update component imports
    sed -i '' "s|from '@/components/Navigation'|from '@/presentation/components/common/Navigation'|g" "$file"
    sed -i '' "s|from '@/components/AgeGate'|from '@/presentation/components/common/AgeGate'|g" "$file"
    sed -i ''  "s|from '@/components/CartSidebar'|from '@/presentation/components/common/CartSidebar'|g" "$file"
    sed -i '' "s|from '@/components/ProductCarousel'|from '@/presentation/components/features/products/ProductCarousel'|g" "$file"
    sed -i '' "s|from '@/components/ProductGallery'|from '@/presentation/components/features/products/ProductGallery'|g" "$file"
    sed -i '' "s|from '@/components/HeroSection'|from '@/presentation/components/features/hero/HeroSection'|g" "$file"
    sed -i '' "s|from '@/components/SocialMediaPreview'|from '@/presentation/components/features/social/SocialMediaPreview'|g" "$file"
    
    # Update context imports
    sed -i '' "s|from '@/contexts/CartContext'|from '@/presentation/contexts/CartContext'|g" "$file"
    
    # Update type imports
    sed -i '' "s|from '@/types'|from '@/shared/types'|g" "$file"
    
    # Update content imports
    sed -i '' "s|from '@/lib/content'|from '@/shared/constants/content'|g" "$file"
    
    # Update locale imports
    sed -i '' "s|from '@/locales/|from '@/shared/locales/|g" "$file"
    
    # Update Supabase imports
    sed -i '' "s|from '@/lib/supabase/|from '@/infrastructure/services/database/|g" "$file"
    sed -i '' "s|from '@/lib/auth/|from '@/infrastructure/services/auth/|g" "$file"
}

# Find all TypeScript/JavaScript files in src/app and update them
echo "📂 Scanning src/app directory..."
find src/app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read file; do
    update_imports "$file"
done

# Update middleware
if [ -f "src/middleware.ts" ]; then
    echo "  Processing: src/middleware.ts"
    update_imports "src/middleware.ts"
fi

# Update presentation layer files
echo "📂 Scanning src/presentation directory..."
find src/presentation -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    update_imports "$file"
done

echo ""
echo "✅ Import paths updated!"
echo ""
echo "⚠️  Note: Please review the changes and test your application."
echo "   Some imports may need manual adjustment."
