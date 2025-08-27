export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  price: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  qrCode?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
}

export interface Payment {
  id: string;
  amount: number;
  restaurantId: string;
  userId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}