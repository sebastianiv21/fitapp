"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useSignUp } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { mutate: signUp, isPending, error } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    signUp(data);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your personalized fitness journey today"
      footerText="Already have an account?"
      footerLink={{ href: "/login", text: "Sign in" }}
    >
      {error && (
        <div className="mb-6">
          <Alert message={error.message} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <Input
            {...register("name")}
            placeholder="Full name (optional)"
            error={errors.name?.message}
            className="pl-12"
          />
        </div>

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

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            className="pl-12"
          />
        </div>

        <Button
          type="submit"
          isLoading={isPending}
          className="w-full"
          size="lg"
        >
          Create Account
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>
    </AuthLayout>
  );
}
