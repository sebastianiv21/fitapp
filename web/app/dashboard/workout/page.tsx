"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, RefreshCw, Clock, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Alert } from "@/components/ui/Alert";
import { profileQuery } from "@/lib/queries";
import { generateWorkout } from "@/lib/api";
import { WorkoutPlan } from "@/types";

function WorkoutDayCard({
  day,
  index,
}: {
  day: WorkoutPlan["days"][0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

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
              <div className="w-12 h-12 bg-[#0f3d2e] rounded-xl flex items-center justify-center">
                <span className="text-[#ccff00] font-bold">{day.day}</span>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[#0f3d2e]">
                  {day.focus}
                </h3>
                <p className="text-sm text-[#0f3d2e]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {day.duration_minutes} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#0f3d2e]/60">
                {day.exercises.length} exercises
              </span>
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-[#0f3d2e]/60" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#0f3d2e]/60" />
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
              <div className="px-6 pb-6 pt-2 border-t border-[#e5e4de]">
                <div className="space-y-4">
                  {day.exercises.map((exercise, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between py-3 border-b border-[#e5e4de]/50 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-[#0f3d2e]">{exercise.name}</p>
                        {exercise.notes && (
                          <p className="text-sm text-[#0f3d2e]/60">{exercise.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#0f3d2e]">
                          {exercise.sets} sets
                        </p>
                        <p className="text-sm text-[#0f3d2e]/60">{exercise.reps}</p>
                        <p className="text-xs text-[#0f3d2e]/50">
                          {exercise.rest_seconds}s rest
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function WorkoutPage() {
  const { data: profile, isLoading: profileLoading } = useQuery(profileQuery());
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Profile not found");
      const data = await generateWorkout({
        goal: profile.goal,
        days_per_week: profile.days_per_week,
        experience_level: "beginner",
        limitations: profile.limitations,
      });
      return data;
    },
    onSuccess: (data) => {
      setWorkout(data);
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
          <h1 className="font-display text-3xl font-bold text-[#0f3d2e]">
            Your Workout Plan
          </h1>
          <p className="text-[#0f3d2e]/60 mt-1">
            AI-generated routine for your fitness level
          </p>
        </div>
        <Button
          onClick={() => mutation.mutate()}
          isLoading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {workout ? (
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
              : "Failed to generate workout plan"
          }
        />
      )}

      {mutation.isPending && !workout && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loading size="lg" />
          <p className="text-[#0f3d2e]/60 mt-4">
            Creating your personalized workout plan...
          </p>
        </div>
      )}

      {workout && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0f3d2e]">{workout.days.length}</p>
              <p className="text-sm text-[#0f3d2e]/60">Training Days</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0f3d2e]">
                {Math.round(workout.days.reduce((acc, d) => acc + d.duration_minutes, 0) / workout.days.length)}
              </p>
              <p className="text-sm text-[#0f3d2e]/60">Avg Minutes/Day</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0f3d2e]">
                {workout.days.reduce((acc, d) => acc + d.exercises.length, 0)}
              </p>
              <p className="text-sm text-[#0f3d2e]/60">Total Exercises</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-[#0f3d2e]">
                {Math.round(workout.days.reduce((acc, d) => acc + d.duration_minutes, 0))}
              </p>
              <p className="text-sm text-[#0f3d2e]/60">Weekly Minutes</p>
            </div>
          </div>

          <div className="space-y-4">
            {workout.days.map((day, index) => (
              <WorkoutDayCard key={day.day} day={day} index={index} />
            ))}
          </div>

          {workout.weekly_notes && (
            <Card glass>
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold text-[#0f3d2e] mb-2">
                  Weekly Notes
                </h3>
                <p className="text-[#0f3d2e]/70">{workout.weekly_notes}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
