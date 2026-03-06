import type * as Types from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response;
}

export const fetchProfile = (): Promise<Types.Profile | null> =>
  fetchWithAuth("/api/v1/user/profile")
    .then((r) => (r.status === 404 ? null : r.json()))
    .catch(() => null);

export const createProfile = (data: Types.ProfileCreate): Promise<Types.Profile> =>
  fetchWithAuth("/api/v1/user/profile", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());

export const calculateNutrition = (data: Types.NutritionInput): Promise<Types.NutritionResult> =>
  fetchWithAuth("/api/v1/nutrition/calculate", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());

export const generateDiet = (data: Types.DietInput): Promise<Types.DietPlan> =>
  fetchWithAuth("/api/v1/nutrition/diet", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());

export const generateWorkout = (data: Types.WorkoutInput): Promise<Types.WorkoutPlan> =>
  fetchWithAuth("/api/v1/workout/generate", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());

export const fetchProgress = (): Promise<Types.ProgressEntry[]> =>
  fetchWithAuth("/api/v1/user/progress").then((r) => r.json());

export const addProgress = (data: Types.ProgressCreate): Promise<Types.ProgressEntry> =>
  fetchWithAuth("/api/v1/user/progress", { method: "POST", body: JSON.stringify(data) }).then((r) => r.json());
