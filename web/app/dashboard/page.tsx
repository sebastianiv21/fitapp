"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Apple,
  Dumbbell,
  TrendingUp,
  Target,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { profileQuery, progressQuery, nutritionQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  color = "primary",
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  color?: "primary" | "secondary" | "accent";
}) {
  const colorStyles = {
    primary: "bg-accent/20 text-base-content",
    secondary: "bg-[#ccff00]/20 text-[#0f3d2e]",
    accent: "bg-[#207d57]/10 text-[#207d57]",
  };

  return (
    <Card glass>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-base-content/60 mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-base-content">
                {value}
              </span>
              {unit && (
                <span className="text-sm text-base-content/60">{unit}</span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              colorStyles[color],
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useQuery(profileQuery());
  const { data: progress, isLoading: progressLoading } =
    useQuery(progressQuery());
  const { data: nutrition, isLoading: nutritionLoading } = useQuery(
    nutritionQuery(profile),
  );

  if (profileLoading || progressLoading || nutritionLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-base-content" />
        </div>
        <h2 className="font-display text-2xl font-bold text-base-content mb-2">
          Complete your profile
        </h2>
        <p className="text-base-content/60 mb-6 max-w-md">
          Let&apos;s set up your profile to generate personalized diet and
          workout plans.
        </p>
        <Link href="/onboarding">
          <Button size="lg">Complete Setup</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-primary mb-2">
          Welcome back!
        </h1>
        <p className="text-base-content/60">
          Here&apos;s your fitness overview for today
        </p>
      </motion.div>

      {nutrition && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Daily Calories"
            value={nutrition.target_calories}
            unit="kcal"
            icon={Target}
            color="primary"
          />
          <StatCard
            title="Protein Target"
            value={nutrition.protein_grams}
            unit="g"
            icon={Activity}
            color="secondary"
          />
          <StatCard
            title="Carbs Target"
            value={nutrition.carbs_grams}
            unit="g"
            icon={TrendingUp}
            color="accent"
          />
          <StatCard
            title="Fat Target"
            value={nutrition.fat_grams}
            unit="g"
            icon={Activity}
            color="secondary"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card glass hover>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-base-content" />
              </div>
              <div>
                <CardTitle>AI Diet Plan</CardTitle>
                <p className="text-sm text-base-content/60 mt-1">
                  Personalized meals based on your goals
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/diet">
              <Button className="w-full">
                View Diet Plan
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card glass hover>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-base-content" />
              </div>
              <div>
                <CardTitle>Workout Routine</CardTitle>
                <p className="text-sm text-base-content/60 mt-1">
                  Custom exercises for your level
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/workout">
              <Button variant="secondary" className="w-full">
                View Workout
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {progress && progress.length > 0 && (
        <Card glass>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Progress</CardTitle>
              <Link href="/dashboard/progress">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progress.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 border-b border-neutral last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-base-content">
                        {entry.weight_kg} kg
                      </p>
                      <p className="text-sm text-base-content/60">
                        {new Date(entry.recorded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
