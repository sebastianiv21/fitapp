export interface User {
  id: string;
  email: string;
  name?: string;
}

export type Gender = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "high";

export type Goal = "maintain" | "lose_fat" | "gain_mass";

export type DietPreference = "omnivore" | "vegetarian" | "vegan";

export interface Profile {
  id: string;
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  days_per_week: number;
  goal: Goal;
  diet_preference?: DietPreference;
  restrictions?: string[];
  limitations?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileCreate {
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  days_per_week: number;
  goal: Goal;
  diet_preference?: DietPreference;
  restrictions?: string[];
  limitations?: string[];
}

export interface NutritionInput {
  age: number;
  gender: Gender;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
}

export interface NutritionResult {
  bmr: number;
  tdee: number;
  target_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  calorie_adjustment: number;
  adjustment_percent: number;
}

export interface DietInput extends NutritionInput {
  preferences?: string;
  restrictions?: string[];
}

export interface Meal {
  name: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  total_calories: number;
  notes: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  duration_minutes: number;
}

export interface WorkoutPlan {
  days: WorkoutDay[];
  weekly_notes: string;
}

export interface WorkoutInput {
  goal: Goal;
  days_per_week: number;
  experience_level?: "beginner" | "intermediate" | "advanced";
  limitations?: string[];
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  weight_kg: number;
  notes?: string;
  recorded_at: string;
}

export interface ProgressCreate {
  weight_kg: number;
  notes?: string;
}
