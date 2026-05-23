export enum TweetCategory {
  ELLIOT_WAVES = "Elliot Waves & Mercados",
  BARRANI = "100% Barrani & Efis",
  COSMIC = "Marcianos & Marte",
  ANTI_COMMUNIST = "Anti-Comunismo & Casta",
  GASTRONOMY = "Soda & Costanera",
}

export interface Tweet {
  id: string;
  category: TweetCategory;
  text: string;
  timestamp: string;
  likes: number;
  retweets: number;
  marketData?: {
    symbol: string;
    price: number;
    change: number;
    verdict: string;
  };
  spaceData?: {
    title: string;
    imageUrl?: string;
    explanation?: string;
  };
  chartImage?: string; // Optional client-uploaded base64 string for Elliott Wave chart screenshots
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isLoading?: boolean;
}

export interface SpaceEvent {
  title: string;
  url: string;
  explanation: string;
  date: string;
}
