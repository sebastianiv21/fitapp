"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, RefreshCw, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Alert } from "@/components/ui/Alert";
import { profileQuery } from "@/lib/queries";
import { generateDiet } from "@/lib/api";
import type { DietPlan } from "@/types";

function MealCard({
  title,
  meal,
  index,
}: {
  title: string;
  meal: DietPlan["breakfast"];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card glass className="overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-base-content" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-base-content">
                  {title}
                </h3>
                <p className="text-sm text-base-content/60">{meal.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-base-content">{meal.calories} kcal</p>
                <p className="text-xs text-base-content/60">
                  P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g
                </p>
              </div>
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-base-content/60" />
              ) : (
                <ChevronDown className="w-5 h-5 text-base-content/60" />
              )}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-neutral">
                <h4 className="text-sm font-medium text-base-content mb-3">Foods:</h4>
                <ul className="space-y-2">
                  {meal.foods.map((food, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-base-content/80"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

function MacroCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <div
        className="w-3 h-3 rounded-full mx-auto mb-2"
        style={{ backgroundColor: color }}
      />
      <p className="text-2xl font-bold text-base-content">{value}g</p>
      <p className="text-sm text-base-content/60">{label}</p>
    </div>
  );
}

export default function DietPage() {
  const { data: profile, isLoading: profileLoading } = useQuery(profileQuery());
  const [diet, setDiet] = useState<DietPlan | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profile not found");
      const data = await generateDiet({
        age: profile.age,
        gender: profile.gender,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        activity_level: profile.activity_level,
        goal: profile.goal,
        preferences: profile.diet_preference || "omnivore",
        restrictions: profile.restrictions,
      });
      return data;
    },
    onSuccess: (data) => {
      setDiet(data);
    },
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <Alert type="error" message="Please complete your profile first" />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-base-content">
            Your Diet Plan
          </h1>
          <p className="text-base-content/60 mt-1">
            AI-generated meals based on your goals
          </p>
        </div>
        <Button
          onClick={() => mutation.mutate()}
          isLoading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {diet ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Plan
            </>
          )}
        </Button>
      </div>

      {mutation.error && (
        <Alert
          type="error"
          message={
            mutation.error instanceof Error
              ? mutation.error.message
              : "Failed to generate diet plan"
          }
        />
      )}

      {mutation.isPending && !diet && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loading size="lg" />
          <p className="text-base-content/60 mt-4">
            Creating your personalized diet plan...
          </p>
        </div>
      )}

      {diet && (
        <>
          <Card glass>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-base-content">
                  Daily Macros
                </h3>
                <p className="text-2xl font-bold text-base-content">
                  {diet.total_calories} kcal
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MacroCard
                  label="Protein"
                  value={diet.breakfast.protein + diet.lunch.protein + diet.dinner.protein + diet.snacks.reduce((acc, s) => acc + s.protein, 0)}
                  color="#22c55e"
                />
                <MacroCard
                  label="Carbs"
                  value={diet.breakfast.carbs + diet.lunch.carbs + diet.dinner.carbs + diet.snacks.reduce((acc, s) => acc + s.carbs, 0)}
                  color="#3b82f6"
                />
                <MacroCard
                  label="Fat"
                  value={diet.breakfast.fat + diet.lunch.fat + diet.dinner.fat + diet.snacks.reduce((acc, s) => acc + s.fat, 0)}
                  color="#f59e0b"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <MealCard title="Breakfast" meal={diet.breakfast} index={0} />
            <MealCard title="Lunch" meal={diet.lunch} index={1} />
            <MealCard title="Dinner" meal={diet.dinner} index={2} />
            {diet.snacks.map((snack, i) => (
              <MealCard key={i} title={`Snack ${i + 1}`} meal={snack} index={3 + i} />
            ))}
          </div>

          {diet.notes && (
            <Card glass>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-base-content mb-2">
                  Notes
                </h3>
                <p className="text-base-content/70">{diet.notes}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
