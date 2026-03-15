export type GameOrientation = "portrait" | "landscape";
export type GameStatus = "draft" | "published" | "hidden";

export interface GameDeveloper {
  name: string;
  website: string;
}

export interface GameStats {
  plays: number;
  likes: number;
  rating: number;
  rating_count: number;
}

export interface GameMonetization {
  ads_enabled: boolean;
  reward_ads: boolean;
}

export interface IGame {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  cover_image: string;
  preview_video_url?: string;
  iframe_url: string;
  orientation: GameOrientation;
  category_ids: string[];
  tags: string[];
  developer: GameDeveloper;
  stats: GameStats;
  monetization: GameMonetization;
  status: GameStatus;
  featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}
