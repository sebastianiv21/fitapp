"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000";

interface SignInInput {
  email: string;
  password: string;
}

interface SignUpInput extends SignInInput {
  name?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

async function fetchJwtToken(): Promise<string> {
  // Better Auth JWT plugin exposes /api/auth/token to get a JWT from session cookie
  const response = await fetch(`${AUTH_BASE}/api/auth/token`, {
    method: "GET",
    credentials: "include", // Include session cookie
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch JWT token");
  }

  const data = await response.json();
  const token = data.token || data.data?.token;
  if (!token) {
    throw new Error("JWT token not found in response");
  }

  return token;
}

async function postAuth(endpoint: string, body: SignInInput | SignUpInput): Promise<AuthResponse> {
  // Step 1: Sign in to create session (sets session cookie)
  const response = await fetch(`${AUTH_BASE}${endpoint}`, {
    method: "POST",
    credentials: "include", // Important: receive session cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Authentication failed");
  }

  const data = await response.json();
  console.log("Auth response:", data);

  // Build user object from various response formats
  let user = data.user || data.data?.user;
  if (!user && data.userId) {
    user = { id: data.userId, email: body.email };
  }
  if (!user) {
    user = { id: data.userId || "", email: body.email };
  }

  // Step 2: Fetch JWT token using the session cookie
  const token = await fetchJwtToken();

  return { token, user };
}

function useAuthMutation(
  endpoint: string,
  redirectPath: string
) {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (input: SignInInput | SignUpInput) =>
      postAuth(endpoint, input),
    onSuccess: (data) => {
      console.log("Storing auth token:", data.token.substring(0, 20) + "...");
      localStorage.setItem("auth_token", data.token);
      setAuth(data.token, data.user);
      router.push(redirectPath);
    },
    onError: (error) => {
      console.error("Auth mutation error:", error);
    },
  });
}

export function useSignIn() {
  return useAuthMutation("/api/auth/sign-in/email", "/dashboard");
}

export function useSignUp() {
  return useAuthMutation("/api/auth/sign-up/email", "/onboarding");
}
