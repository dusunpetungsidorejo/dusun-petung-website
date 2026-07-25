export type Page = "home" | "profile" | "village-life" | "camp" | "admin" | "livein";

export interface Setting {
  id?: number;
  village_name?: string;
  logo_url?: string;
  hero_image_url?: string;
  phone_number?: string;
  instagram_url?: string;
  tiktok_url?: string;
}

export interface Activity {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  date?: string;
  uploaded_at?: string;
}

export interface LiveInHouse {
  id?: number;
  name: string;
  owner: string;
  cover_image: string;
  gallery: string[];
  description: string;
  highlight?: string;
  overnight_active: boolean;
  overnight_price?: number;
  overnight_checkin?: string;
  overnight_checkout?: string;
  hour24_active: boolean;
  hour24_price?: number;
  hour24_description?: string;
  pricing_type: 'house' | 'person';
  min_guests?: number;
  max_guests?: number;
  facilities: string[];
  facilities_other?: string;
  experiences: string[];
  experiences_other?: string;
  status: 'Available' | 'Unavailable' | 'Inactive';
  updated_at?: string;
}

export interface LiveInPackage {
  id?: number;
  name: string;
  price: number;
  pricing_type: string;
  description: string;
  facilities: string[];
  icon?: string;
  active: boolean;
  updated_at?: string;
}

export interface CampPackage {
  id?: number;
  name: string;
  capacity: string;
  price: number;
  description: string;
  active: boolean;
  updated_at?: string;
}

export interface CampRental {
  id?: number;
  name: string;
  category: string;
  price: number;
  active: boolean;
  updated_at?: string;
}

export interface Demographic {
  id?: number;
  icon: string;
  value: string;
  label: string;
  updated_at?: string;
}
