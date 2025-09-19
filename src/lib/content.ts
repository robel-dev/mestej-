import { SiteContent, Product, WebshopProduct, MenuItemType } from '@/types';

export const languages = {
  en: { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  sv: { code: 'sv' as const, name: 'Svenska', flag: '🇸🇪' },
};

export const menuItems: MenuItemType[] = [
  { label: 'About', route: '/about' },
  { label: 'History', route: '/history' },
  { label: 'Wines & Liquors', route: '/wines' },
  { label: 'Contact', route: '/contact' },
  { label: 'Login', route: '/login' },
  { label: 'Ordering', route: '/ordering' },
  { label: 'Webshop', route: '/webshop' },
];

export const content: Record<'en' | 'sv', SiteContent> = {
  en: {
    nav: {
      about: 'About',
      history: 'History', 
      wines: 'Wines & Liquors',
      contact: 'Contact',
      login: 'Login',
      ordering: 'Ordering',
      webshop: 'Webshop',
    },
    hero: {
      title: 'Mestej Winery',
      subtitle: 'Crafting honey, buckthorn, and blueberry wines with tradition and care.',
      cta: 'Discover Our Wines',
    },
    about: {
      title: 'About Mestej',
      content: 'Mestej blends local tradition and modern craftsmanship in winemaking. Our passion lies in creating exceptional meads and fruit wines that honor both heritage and innovation.',
    },
    wines: {
      title: 'Our Premium Collection',
      subtitle: 'Discover our handcrafted honey, buckthorn, and blueberry wines',
    },
    contact: {
      title: 'Contact Us',
      form: {
        name: 'Your Name',
        email: 'Email Address',
        message: 'Your Message',
        submit: 'Send Message',
      },
    },
    ageGate: {
      title: 'Age Verification Required',
      message: 'Please confirm you are of legal drinking age to enter.',
      confirm: 'Yes, I am of legal age',
      deny: 'No',
      error: 'Sorry, you must be of legal drinking age to enter.',
    },
  },
  sv: {
    nav: {
      about: 'Om Oss',
      history: 'Historia',
      wines: 'Viner & Sprit',
      contact: 'Kontakt',
      login: 'Logga In',
      ordering: 'Beställning',
      webshop: 'Webshop',
    },
    hero: {
      title: 'Mestej Vingård',
      subtitle: 'Tillverkar honung-, havtorn- och blåbärsviner med tradition och omsorg.',
      cta: 'Upptäck Våra Viner',
    },
    about: {
      title: 'Om Mestej',
      content: 'Mestej blandar lokal tradition och modernt hantverk inom vinframställning. Vår passion ligger i att skapa exceptionella mjöder och fruktviner som hedrar både arv och innovation.',
    },
    wines: {
      title: 'Vår Premiumkollektion',
      subtitle: 'Upptäck våra handgjorda honung-, havtorn- och blåbärsviner',
    },
    contact: {
      title: 'Kontakta Oss',
      form: {
        name: 'Ditt Namn',
        email: 'E-postadress',
        message: 'Ditt Meddelande',
        submit: 'Skicka Meddelande',
      },
    },
    ageGate: {
      title: 'Åldersverifiering Krävs',
      message: 'Vänligen bekräfta att du är myndig för att komma in.',
      confirm: 'Ja, jag är myndig',
      deny: 'Nej',
      error: 'Tyvärr, du måste vara myndig för att komma in.',
    },
  },
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
