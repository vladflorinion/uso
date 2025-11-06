export type UnitPreference = {
  weight: 'kg' | 'lbs';
  hydration: 'L' | 'oz';
};

export type GoalSettings = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
};

export type UserSettings = {
  id?: string;
  userId?: string;
  theme: 'dark' | 'light';
  units: UnitPreference;
  goals: GoalSettings;
  updatedAt?: string;
};
