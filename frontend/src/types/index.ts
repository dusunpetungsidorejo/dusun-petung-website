export type Page = "home" | "profile" | "village-life" | "camp" | "admin";

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
}
