import { QueryClient, queryOptions, mutationOptions, skipToken } from "@tanstack/react-query";
import {
  fetchProfile,
  createProfile,
  calculateNutrition,
  generateDiet,
  generateWorkout,
  fetchProgress,
  addProgress,
} from "./api";
import type {
  ProfileCreate,
  NutritionInput,
  DietInput,
  WorkoutInput,
  ProgressCreate,
  Profile,
} from "@/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

export const profileQuery = () =>
  queryOptions({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

export const progressQuery = () =>
  queryOptions({
    queryKey: ["progress"],
    queryFn: fetchProgress,
  });

export const nutritionQuery = (profile: Profile | null | undefined) =>
  queryOptions({
    queryKey: ["nutrition", profile?.id],
    queryFn: profile
      ? () =>
          calculateNutrition({
            age: profile.age,
            gender: profile.gender,
            height_cm: profile.height_cm,
            weight_kg: profile.weight_kg,
            activity_level: profile.activity_level,
            goal: profile.goal,
          })
      : skipToken,
    enabled: !!profile,
  });

export const createProfileMutation = () =>
  mutationOptions({
    mutationFn: createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

export const calculateNutritionMutation = () =>
  mutationOptions({
    mutationFn: calculateNutrition,
  });

export const generateDietMutation = () =>
  mutationOptions({
    mutationFn: generateDiet,
  });

export const generateWorkoutMutation = () =>
  mutationOptions({
    mutationFn: generateWorkout,
  });

export const addProgressMutation = () =>
  mutationOptions({
    mutationFn: addProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
