"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { createProfile } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const onboardingSchema = z.object({
  age: z.number().min(13).max(100),
  gender: z.enum(["male", "female"]),
  height_cm: z.number().min(100).max(250),
  weight_kg: z.number().min(30).max(300),
  activity_level: z.enum(["sedentary", "light", "moderate", "high"]),
  days_per_week: z.number().min(1).max(7),
  goal: z.enum(["maintain", "lose_fat", "gain_mass"]),
  diet_preference: z.enum(["omnivore", "vegetarian", "vegan"]).optional(),
  restrictions: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
});

type OnboardingInput = z.infer<typeof onboardingSchema>;

const steps = [
  { title: "Basics", fields: ["age", "gender"] },
  { title: "Body", fields: ["height_cm", "weight_kg"] },
  { title: "Activity", fields: ["activity_level", "days_per_week"] },
  { title: "Goals", fields: ["goal", "diet_preference"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      age: 25,
      gender: "male",
      height_cm: 170,
      weight_kg: 70,
      activity_level: "moderate",
      days_per_week: 3,
      goal: "maintain",
      diet_preference: "omnivore",
    },
  });

  const mutation = useMutation({
    mutationFn: createProfile,
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: OnboardingInput) => {
    mutation.mutate(data);
  };

  const nextStep = async () => {
    const fields = steps[currentStep].fields as (keyof OnboardingInput)[];
    const valid = await trigger(fields);
    if (valid && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const activityOptions = [
    { value: "sedentary", label: "Sedentary (little to no exercise)" },
    { value: "light", label: "Light (1-3 days/week)" },
    { value: "moderate", label: "Moderate (3-5 days/week)" },
    { value: "high", label: "High (6-7 days/week)" },
  ];

  const goalOptions = [
    { value: "maintain", label: "Maintain weight" },
    { value: "lose_fat", label: "Lose fat" },
    { value: "gain_mass", label: "Build muscle" },
  ];

  const dietOptions = [
    { value: "omnivore", label: "Omnivore (no restrictions)" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
  ];

  const dayOptions = Array.from({ length: 7 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} day${i > 0 ? "s" : ""}/week`,
  }));

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="font-display text-2xl font-semibold text-base-content mb-6">
              Basic Information
            </h2>
            <div className="grid gap-6">
              <Input
                {...register("age", { valueAsNumber: true })}
                type="number"
                label="Age (years)"
                error={errors.age?.message}
              />
              <Select
                {...register("gender")}
                label="Gender"
                options={genderOptions}
                error={errors.gender?.message}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h2 className="font-display text-2xl font-semibold text-base-content mb-6">
              Body Metrics
            </h2>
            <div className="grid gap-6">
              <Input
                {...register("height_cm", { valueAsNumber: true })}
                type="number"
                label="Height (cm)"
                error={errors.height_cm?.message}
              />
              <Input
                {...register("weight_kg", { valueAsNumber: true })}
                type="number"
                label="Weight (kg)"
                error={errors.weight_kg?.message}
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="font-display text-2xl font-semibold text-base-content mb-6">
              Activity Level
            </h2>
            <div className="grid gap-6">
              <Select
                {...register("activity_level")}
                label="How active are you?"
                options={activityOptions}
                error={errors.activity_level?.message}
              />
              <Select
                {...register("days_per_week", { valueAsNumber: true })}
                label="Days available to train"
                options={dayOptions}
                error={errors.days_per_week?.message}
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="font-display text-2xl font-semibold text-base-content mb-6">
              Your Goals
            </h2>
            <div className="grid gap-6">
              <Select
                {...register("goal")}
                label="What is your primary goal?"
                options={goalOptions}
                error={errors.goal?.message}
              />
              <Select
                {...register("diet_preference")}
                label="Diet preference (optional)"
                options={dietOptions}
                error={errors.diet_preference?.message}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-base-100 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-base-content mb-2">
            Let&apos;s get to know you
          </h1>
          <p className="text-base-content/60">
            We&apos;ll use this to create your personalized plan
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-accent text-accent-content"
                    : "bg-neutral text-base-content/50"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStep ? "bg-accent" : "bg-neutral"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="glass-card rounded-2xl p-8 min-h-100">
            {mutation.error && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={
                    mutation.error instanceof Error
                      ? mutation.error.message
                      : "Something went wrong"
                  }
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6 border-t border-neutral">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={mutation.isPending}
                  variant="primary"
                >
                  Complete Setup
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
