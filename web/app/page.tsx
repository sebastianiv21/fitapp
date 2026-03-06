"use client";

import { motion } from "framer-motion";
import { Activity, Apple, Dumbbell, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f3d2e]/5 via-transparent to-[#ccff00]/10" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccff00]/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#0f3d2e]" />
              <span className="text-sm font-medium text-[#0f3d2e]">
                AI-Powered Fitness
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-[#0f3d2e] mb-6 leading-tight">
              Your Personal
              <br />
              <span className="text-[#207d57]">Fitness Coach</span>
            </h1>
            
            <p className="text-xl text-[#0f3d2e]/70 max-w-2xl mx-auto mb-10">
              Get personalized diet plans and workout routines powered by AI. 
              Track your progress and achieve your goals faster.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">Sign In</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-[#0f3d2e] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-[#0f3d2e]/70">
              Three powerful tools to transform your fitness journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Apple,
                title: "AI Diet Plans",
                description: "Personalized meal plans based on your goals, preferences, and dietary restrictions.",
              },
              {
                icon: Dumbbell,
                title: "Smart Workouts",
                description: "Custom exercise routines adapted to your fitness level and available time.",
              },
              {
                icon: Activity,
                title: "Progress Tracking",
                description: "Monitor your weight, measurements, and achievements over time.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card glass hover className="h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-[#ccff00]/20 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-[#0f3d2e]" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-[#0f3d2e] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-[#0f3d2e]/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0f3d2e] rounded-3xl p-12 md:p-16 text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#faf9f6] mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-[#faf9f6]/70 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who have transformed their lives with AI-powered fitness guidance.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[#ccff00] text-[#0f3d2e] hover:bg-[#b3e600]">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
