// src/contexts/StoreContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Store {
  id: string;
  name: string;
  category: string;
  image: any;
  description: string;
  address: string;
  rating: number;
  distance: number;
  currentReward: number;
  isAvailable: boolean;
  freePostsRemaining: number;
}

interface StoreContextType {
  stores: Store[];
  addStore: (store: Omit<Store, 'id'>) => void;
  updateStore: (id: string, store: Partial<Store>) => void;
  deleteStore: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

// 現在の時間帯に基づく報酬を取得する関数
const getCurrentReward = (): number => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  
  if (hour >= 14 && hour < 17) {
    return 150; // アイドルタイム
  } else if (hour >= 17 && hour < 19) {
    return 120; // 平日夜早め
  } else if (hour >= 12 && hour < 13.5) {
    return 80; // ピーク時
  } else {
    return 100; // 通常時間
  }
};

// 初期データ
const initialStores: Store[] = [
  {
    id: '1',
    name: '和食処 さくら',
    category: '和食',
    image: require('../../assets/images/stores/sakura.jpg'),
    description: 'こだわりの食材を使った季節の和食をお楽しみください。落ち着いた雰囲気の店内でゆっくりとお食事をどうぞ。',
    address: '東京都渋谷区神宮前1-2-3',
    rating: 4.5,
    distance: 0.3,
    currentReward: getCurrentReward(),
    isAvailable: true,
    freePostsRemaining: 2,
  },
  {
    id: '2',
    name: 'ラーメン横丁',
    category: 'ラーメン',
    image: require('../../assets/images/stores/ramen.jpg'),
    description: '濃厚豚骨スープが自慢のラーメン店。深夜まで営業しているので、遅い時間でもお楽しみいただけます。',
    address: '東京都新宿区歌舞伎町2-1-5',
    rating: 4.2,
    distance: 0.8,
    currentReward: getCurrentReward(),
    isAvailable: true,
    freePostsRemaining: 1,
  },
  {
    id: '3',
    name: '寿司 一心',
    category: '寿司',
    image: require('../../assets/images/stores/sushi.jpg'),
    description: '新鮮な魚介を使った本格江戸前寿司。職人の技が光る逸品をカウンターでお楽しみください。',
    address: '東京都中央区銀座4-5-6',
    rating: 4.8,
    distance: 1.2,
    currentReward: getCurrentReward(),
    isAvailable: true,
    freePostsRemaining: 3,
  },
  {
    id: '4',
    name: 'カフェ・ド・パリ',
    category: 'カフェ',
    image: require('../../assets/images/stores/cafe.jpg'),
    description: 'パリの街角にあるような雰囲気のカフェ。こだわりのコーヒーと手作りスイーツをご提供。',
    address: '東京都港区表参道3-4-7',
    rating: 4.3,
    distance: 0.5,
    currentReward: getCurrentReward(),
    isAvailable: true,
    freePostsRemaining: 0,
  },
];

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>(initialStores);

  const addStore = (storeData: Omit<Store, 'id'>) => {
    const newStore: Store = {
      ...storeData,
      id: Date.now().toString(), // 簡単なID生成
      rating: 4.0, // デフォルト評価
      distance: Math.round((Math.random() * 2 + 0.1) * 10) / 10, // ランダムな距離
      currentReward: getCurrentReward(),
      isAvailable: true,
      freePostsRemaining: Math.floor(Math.random() * 4), // 0-3のランダム
    };
    setStores(prev => [...prev, newStore]);
  };

  const updateStore = (id: string, storeData: Partial<Store>) => {
    setStores(prev => 
      prev.map(store => 
        store.id === id ? { ...store, ...storeData } : store
      )
    );
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(store => store.id !== id));
  };

  return (
    <StoreContext.Provider value={{ stores, addStore, updateStore, deleteStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export type { Store };