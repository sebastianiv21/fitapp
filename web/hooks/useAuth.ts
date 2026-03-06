"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

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

async function postAuth(endpoint: string, body: object): Promise<AuthResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Authentication failed");
  }

  return response.json();
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
      localStorage.setItem("auth_token", data.token);
      setAuth(data.token, data.user);
      router.push(redirectPath);
    },
  });
}

export function useSignIn() {
  return useAuthMutation("/api/auth/sign-in/email", "/dashboard");
}

export function useSignUp() {
  return useAuthMutation("/api/auth/sign-up/email", "/onboarding");
}
