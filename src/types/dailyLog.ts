export type BowelMovement = {
  time: string;
  bristolScale: number;
  urgency: number;
  discomfort: number;
  notes?: string;
};

export type DailyLog = {
  id?: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  steps: number;
  cardio: number;
  water: number;
  weight: number;
  bowelMovement?: BowelMovement;
  createdAt?: string;
  updatedAt?: string;
};
