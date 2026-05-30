export type MealTime = 'desayuno' | 'comida' | 'cena' | 'snack';

export interface MealItem {
  group: string;
  subgroup: string;
  food: string;
  portion: 'pequeña' | 'mediana' | 'grande';
}

export interface DrinkItem {
  type: string;
  name: string;
  portion: string;
}

export interface DailyLog {
  id?: string;
  date: string;
  userId?: string;
  meals?: Record<MealTime, MealItem[]>;
  wellness?: { energy?: number; satiety?: number; sleep?: number };
  activities?: { type?: string; minutes?: number }[];
  sleep?: { hours?: number; quality?: number };
  drinks?: DrinkItem[];
  mealTimes?: { first?: string; last?: string };
  metrics?: {
    weight?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
    glucose?: number;
    note?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}