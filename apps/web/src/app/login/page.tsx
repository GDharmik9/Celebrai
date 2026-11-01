"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/lib/store/event-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge } from "@celebrai/ui";
import { Sparkles, ArrowRight, UserCheck, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loginWithDemo, logout, loadDemoData } = useEventStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginWithDemo();
      setIsLoading(false);
      router.push("/events");
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    loginWithDemo();
    loadDemoData();
    setTimeout(() => {
      setIsLoading(false);
      router.push("/events/new?tab=budget");
    }, 400);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-800 text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to CelebrAI
          </h1>
          <p className="text-sm text-slate-500">
            Intelligent Event Planning powered by Gemini AI
          </p>
        </div>

        {/* Existing Session Notice */}
        {isAuthenticated && user && (
          <Card className="border-emerald-200 bg-emerald-50/70">
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-emerald-900">Currently Logged In</p>
                <p className="text-emerald-700">
                  {user.name} ({user.email})
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push("/events")}
                    className="gap-1"
                  >
                    Go to Events <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Card */}
        <Card variant="bordered" className="bg-white shadow-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter credentials or load instant demo data with pre-configured event budgets & DAG schedules.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Quick Demo Button (Highlighted) */}
            <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700">
                  <Zap className="h-3.5 w-3.5 fill-violet-600 text-violet-600" />
                  Instant Evaluator Mode
                </span>
                <Badge variant="default">Pre-loaded</Badge>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Loads the <strong>Udaipur Palace Wedding (₹85L)</strong> with full budget line items, 15+ DAG milestones, vendor RFPs, and color palettes.
              </p>
              <Button
                onClick={handleDemoLogin}
                isLoading={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Sign In with Demo Data
              </Button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs uppercase text-slate-400 font-medium">
                Or Continue With Email
              </span>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="host@example.com"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-slate-100 text-xs text-slate-500 gap-1.5">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <span>Secure sandbox session with local state persistence</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

