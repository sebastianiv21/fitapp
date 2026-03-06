"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Plus,
  Calendar,
  Scale,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Alert } from "@/components/ui/Alert";
import { progressQuery, addProgressMutation } from "@/lib/queries";
import { ProgressEntry } from "@/types";

function ProgressChart({ data }: { data: ProgressEntry[] }) {
  const sorted = [...data].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );
  const min = Math.min(...sorted.map((d) => d.weight_kg)) - 1;
  const max = Math.max(...sorted.map((d) => d.weight_kg)) + 1;
  const range = max - min || 1;

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="#e5e4de"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <path
          d={`
            M 0 ${100 - ((sorted[0]?.weight_kg - min) / range) * 100}
            ${sorted
              .map((d, i) => {
                const x = (i / (sorted.length - 1 || 1)) * 100;
                const y = 100 - ((d.weight_kg - min) / range) * 100;
                return `L ${x} ${y}`;
              })
              .join(" ")}
            L 100 100
            L 0 100
            Z
          `}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={`
            M 0 ${100 - ((sorted[0]?.weight_kg - min) / range) * 100}
            ${sorted
              .map((d, i) => {
                const x = (i / (sorted.length - 1 || 1)) * 100;
                const y = 100 - ((d.weight_kg - min) / range) * 100;
                return `L ${x} ${y}`;
              })
              .join(" ")}
          `}
          fill="none"
          stroke="#0f3d2e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {sorted.map((d, i) => {
          const x = (i / (sorted.length - 1 || 1)) * 100;
          const y = 100 - ((d.weight_kg - min) / range) * 100;
          return (
            <circle
              key={d.id}
              cx={x}
              cy={y}
              r="3"
              fill="#ccff00"
              stroke="#0f3d2e"
              strokeWidth="2"
            />
          );
        })}

        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f3d2e" />
            <stop offset="100%" stopColor="#0f3d2e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#0f3d2e]/60">
        {sorted.length > 0 && (
          <>
            <span>{new Date(sorted[0].recorded_at).toLocaleDateString()}</span>
            <span>
              {new Date(sorted[sorted.length - 1].recorded_at).toLocaleDateString()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { data: progress, isLoading } = useQuery(progressQuery());
  const [showForm, setShowForm] = useState(false);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation(addProgressMutation());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        weight_kg: parseFloat(weight),
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setWeight("");
          setNotes("");
          setShowForm(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" />
      </div>
    );
  }

  const latestWeight = progress?.[0]?.weight_kg;
  const previousWeight = progress?.[1]?.weight_kg;
  const weightChange =
    latestWeight && previousWeight ? latestWeight - previousWeight : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0f3d2e]">
            Progress Tracking
          </h1>
          <p className="text-[#0f3d2e]/60 mt-1">
            Monitor your weight and fitness journey
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card glass>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    step="0.1"
                    label="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    label="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you feeling?"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    isLoading={mutation.isPending}
                    disabled={!weight}
                  >
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              {mutation.error && (
                <div className="mt-4">
                  <Alert
                    type="error"
                    message={
                      mutation.error instanceof Error
                        ? mutation.error.message
                        : "Failed to add entry"
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {progress && progress.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card glass>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#ccff00]/20 rounded-xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-[#0f3d2e]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#0f3d2e]/60">Current Weight</p>
                    <p className="font-display text-2xl font-bold text-[#0f3d2e]">
                      {latestWeight} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0f3d2e]/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#0f3d2e]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#0f3d2e]/60">Change</p>
                    <p
                      className={`font-display text-2xl font-bold ${
                        weightChange < 0
                          ? "text-green-600"
                          : weightChange > 0
                          ? "text-red-600"
                          : "text-[#0f3d2e]"
                      }`}
                    >
                      {weightChange > 0 ? "+" : ""}
                      {weightChange.toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#207d57]/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#207d57]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#0f3d2e]/60">Total Entries</p>
                    <p className="font-display text-2xl font-bold text-[#0f3d2e]">
                      {progress.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card glass>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart data={progress} />
            </CardContent>
          </Card>
        </>
      )}

      <Card glass>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {progress && progress.length > 0 ? (
            <div className="divide-y divide-[#e5e4de]">
              {progress.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#207d57]/10 rounded-lg flex items-center justify-center">
                      <Scale className="w-5 h-5 text-[#207d57]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0f3d2e]">
                        {entry.weight_kg} kg
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-[#0f3d2e]/60">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#0f3d2e]/60">
                    {new Date(entry.recorded_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-[#0f3d2e]/20 mx-auto mb-4" />
              <p className="text-[#0f3d2e]/60">
                No entries yet. Start tracking your progress!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
