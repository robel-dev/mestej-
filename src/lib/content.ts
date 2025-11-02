import { SiteContent, Product, WebshopProduct, MenuItemType } from '@/types';
import enContent from '@/locales/en.json';
import svContent from '@/locales/sv.json';

export const languages = {
  en: { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  sv: { code: 'sv' as const, name: 'Svenska', flag: '🇸🇪' },
};

export const getMenuItems = (locale: string): MenuItemType[] => [
  { label: 'About', route: `/${locale}/about` },
  { label: 'History', route: `/${locale}/history` },
  { label: 'Wines & Liquors', route: `/${locale}/wines` },
  { label: 'Login', route: `/${locale}/login` },
  { label: 'Ordering', route: `/${locale}/ordering` },
  { label: 'Webshop', route: `/${locale}/webshop` },
  { label: 'Contact', route: `/${locale}/contact` },
];

export const content: Record<'en' | 'sv', SiteContent> = {
  en: enContent as SiteContent,
  sv: svContent as SiteContent,
};

export const products: Product[] = [
  {
    name: 'Golden Honey Mead',
    type: 'honey',
    image_url: '/assets/honey-mead.jpg',
    available_at: ['Restaurant A', 'Restaurant B'],
    systembolaget_link: 'https://systembolaget.se/honey',
  },
  {
    name: 'Buckthorn Bliss',
    type: 'buckthorn',
    image_url: '/assets/buckthorn-wine.jpg', 
    available_at: ['Restaurant C'],
    systembolaget_link: 'https://systembolaget.se/buckthorn',
  },
  {
    name: 'Blueberry Reserve',
    type: 'blueberry',
    image_url: '/assets/blueberry-wine.jpg',
    available_at: ['Restaurant D'],
    systembolaget_link: 'https://systembolaget.se/blueberry',
  },
];

export const webshopProducts: WebshopProduct[] = [
  {
    name: 'Mestej T-Shirt',
    category: 'merchandise',
    price: 25,
    image_url: '/assets/tshirt.jpg',
  },
  {
    name: 'Golden Wine Glass',
    category: 'merchandise', 
    price: 15,
    image_url: '/assets/wine-glass.jpg',
  },
];

export const socialLinks = {
  tiktok: 'https://tiktok.com/mestej',
  instagram: 'https://instagram.com/mestej',
};

export const promoVideoUrl = 'https://example.com/promo.mp4';
