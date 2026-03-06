"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useSignIn } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { mutate: signIn, isPending, error } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    signIn(data);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your fitness journey"
      footerText="Don't have an account?"
      footerLink={{ href: "/register", text: "Sign up" }}
    >
      {error && (
        <div className="mb-6">
          <Alert message={error.message} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <Input
            {...register("email")}
            type="email"
            placeholder="Email address"
            error={errors.email?.message}
            className="pl-12"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <Input
            {...register("password")}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
            className="pl-12"
          />
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          className="w-full"
          size="lg"
        >
          Sign In
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </AuthLayout>
  );
}
