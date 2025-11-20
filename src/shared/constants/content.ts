import { SiteContent, Product, WebshopProduct, MenuItemType } from '@/shared/types';
import enContent from '@/shared/locales/en.json';
import svContent from '@/shared/locales/sv.json';

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
  en: enContent as unknown as SiteContent,
  sv: svContent as unknown as SiteContent,
};

export const products: Product[] = [
  {
    name: 'Golden Honey Mead',
    type: 'honey',
    image_url: '/images/honey-wine.jpeg',
    available_at: ['Gojo Restaurant', 'Ocra restaurant', 'Sjätte tunnan Restaurant', 'Systembolaget online order'],
    systembolaget_link: 'https://systembolaget.se/',
  },
  {
    name: 'Buckthorn Bliss',
    type: 'buckthorn',
    image_url: '/images/buckthorn.jpeg',
    available_at: ['Gojo Restaurant', 'Ocra restaurant', 'Sjätte tunnan Restaurant', 'Systembolaget online order'],
    systembolaget_link: 'https://systembolaget.se/',
  },
  {
    name: 'Blueberry Reserve',
    type: 'blueberry',
    image_url: '/images/blueberry.jpeg',
    available_at: ['Gojo Restaurant', 'Ocra restaurant', 'Sjätte tunnan Restaurant', 'Systembolaget online order'],
    systembolaget_link: 'https://systembolaget.se/',
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
  tiktok: 'https://tiktok.com/',
  instagram: 'https://instagram.com/',
};

export const promoVideoUrl = '/videos/mestej.mp4';
