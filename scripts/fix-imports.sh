#!/bin/bash

# Enhanced Import Path Update Script
# Fixes all remaining old import paths

echo "🔧 Fixing remaining import paths..."
echo ""

# Update admin component imports in all admin pages
echo "📂 Updating admin component imports..."
find src/app/admin -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '@/components/admin/AdminSidebar'|from '@/presentation/components/admin/AdminSidebar'|g" \
  -e "s|from '@/components/admin/AdminHeader'|from '@/presentation/components/admin/AdminHeader'|g" \
  -e "s|from '@/components/admin/DashboardStats'|from '@/presentation/components/admin/DashboardStats'|g" \
  {} \;

echo "✅ Admin component imports updated!"
echo ""

# Update any remaining @/lib/supabase imports (including dynamic imports)
echo "📂 Updating database service imports..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|'@/lib/supabase/|'@/infrastructure/services/database/|g" \
  {} \;

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e 's|"@/lib/supabase/|"@/infrastructure/services/database/|g' \
  {} \;

echo "✅ Database service imports updated!"
echo ""

# Update any remaining @/contexts imports
echo "📂 Updating context imports..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '@/contexts/|from '@/presentation/contexts/|g" \
  {} \;

echo "✅ Context imports updated!"
echo ""

# Update any remaining @/types imports
echo "📂 Updating type imports..."
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s|from '@/types'|from '@/shared/types'|g" \
  -e "s|from '@/types/|from '@/shared/types/|g" \
  {} \;

echo "✅ Type imports updated!"
echo ""

echo "🎉 All remaining import paths fixed!"
