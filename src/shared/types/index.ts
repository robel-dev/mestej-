export interface Product {
  name: string;
  type: 'honey' | 'buckthorn' | 'blueberry';
  image_url: string;
  available_at: string[];
  systembolaget_link: string;
}

export interface WebshopProduct {
  name: string;
  category: string;
  price: number;
  image_url: string;
}

export interface SocialLinks {
  tiktok: string;
  instagram: string;
}

export interface MenuItemType {
  label: string;
  route: string;
}

export interface Language {
  code: 'en' | 'sv';
  name: string;
  flag: string;
}

export interface SiteContent {
  nav: {
    [key: string]: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    welcome: {
      title: string;
      description: string;
    };
    aboutUs: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    viewProducts: string;
  };
  history: {
    title: string;
    subtitle: string;
    origins: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    european: {
      title: string;
      description: string;
    };
    legacy: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
  };
  wines: {
    title: string;
    subtitle: string;
    clickToLearnMore: string;
    availableAt: string;
    buyButton: string;
    fineDining: {
      title: string;
      description: string;
      viewLocations: string;
    };
  };
  webshop: {
    title: string;
    subtitle: string;
    comingSoon: string;
    products: {
      tshirt: string;
      wineGlass: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      successMessage: string;
    };
    info: {
      title: string;
      email: string;
      emailAddress: string;
      location: string;
      locationName: string;
      businessHours: string;
      weekdays: string;
      weekend: string;
      mapComingSoon: string;
    };
  };
  products: {
    title: string;
    subtitle: string;
    meads: Array<{
      name: string;
      type: string;
      description: string;
      optimalConditions: {
        title: string;
        serve: string;
        glassware: string;
        servingSize: string;
      };
      foodPairings: {
        title: string;
        subtitle: string;
        pairings: string[];
      };
      image: string;
    }>;
  };
  home: {
    products: {
      title: string;
      subtitle: string;
      availableAt: string;
      buyButton: string;
      autoPlaying: string;
      paused: string;
    };
    social: {
      title: string;
      subtitle: string;
      joinCommunity: string;
      followInstagram: string;
      followTiktok: string;
    };
    video: {
      title: string;
      comingSoon: string;
    };
  };
  ordering: {
    title: string;
    subtitle: string;
    comingSoon: {
      title: string;
      message: string;
      contactButton: string;
    };
  };
  catalog: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      wine: string;
      liquor: string;
      merchandise: string;
    };
    showing: string;
    noProducts: string;
    priceOnRequest: string;
    abv: string;
  };
  cart: {
    title: string;
    empty: string;
    browseProducts: string;
    subtotal: string;
    proceedToCheckout: string;
    clearCart: string;
    addToCart: string;
    remove: string;
    total: string;
    outOfStock: string;
  };
  common: {
    loading: string;
    error: string;
    currency: string;
  };
  ageGate: {
    title: string;
    message: string;
    confirm: string;
    deny: string;
    error: string;
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      submit: string;
      noAccount: string;
      signUp: string;
      forgotPassword: string;
      errors: {
        invalidCredentials: string;
        generic: string;
      };
      success: string;
    };
    signup: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      confirmPassword: string;
      submit: string;
      hasAccount: string;
      signIn: string;
      errors: {
        passwordMismatch: string;
        weakPassword: string;
        invalidEmail: string;
        emailExists: string;
        generic: string;
      };
      success: string;
      pendingApproval: string;
    };
    status: {
      pending: string;
      approved: string;
      rejected: string;
      blocked: string;
    };
  };
}


export interface AgeGateProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}
