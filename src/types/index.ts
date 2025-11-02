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
    content: string;
  };
  wines: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
    };
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
