"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/lib/store/event-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from "@celebrai/ui";
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Zap,
  UserPlus,
  LogIn,
  Lock,
  Mail,
  User,
  Briefcase,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, loginWithDemo, registerUser, logout, loadDemoData } =
    useEventStore();

  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("priya.sharma@example.com");
  const [signInPassword, setSignInPassword] = useState("password123");

  // Register State
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("Event Host / Couple");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regAgreed, setRegAgreed] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginWithDemo();
      setIsLoading(false);
      router.push("/events");
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      registerUser({
        name: regName.trim(),
        role: regRole,
        email: regEmail.trim(),
      });
      setIsLoading(false);
      router.push("/events");
    }, 400);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    loginWithDemo();
    loadDemoData();
    setTimeout(() => {
      setIsLoading(false);
      router.push("/events/new?tab=budget");
    }, 300);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-800 text-white shadow-lg shadow-violet-500/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to CelebrAI
          </h1>
          <p className="text-sm text-slate-500">
            Autonomous Multi-Agent Event Intelligence Platform
          </p>
        </div>

        {/* Existing Session Alert */}
        {isAuthenticated && user && (
          <Card className="border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-emerald-900">Currently Active Session</p>
                <p className="text-emerald-700 text-xs">
                  {user.name} ({user.role}) &bull; {user.email}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push("/events")}
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Go to Events Directory <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "signin"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "register"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Create Account / Register
          </button>
        </div>

        {/* Main Card */}
        <Card variant="bordered" className="bg-white shadow-md">
          {activeTab === "signin" ? (
            <>
              <CardHeader className="pb-3">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Access your AI event workspaces or test with one-click evaluator mode.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* 1-Click Evaluator Mode Box */}
                <div className="rounded-xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700">
                      <Zap className="h-3.5 w-3.5 fill-violet-600 text-violet-600" />
                      Instant Evaluator Mode
                    </span>
                    <Badge variant="default">Pre-loaded</Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Loads the <strong>Udaipur Palace Wedding (₹85L)</strong> with full budget line
                    items, 15+ DAG milestones, vendor RFPs, and color palettes.
                  </p>
                  <Button
                    onClick={handleDemoLogin}
                    isLoading={isLoading}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    Sign In with Pre-loaded Demo
                  </Button>
                </div>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-3 text-xs uppercase text-slate-400 font-medium">
                    Or Sign In with Email
                  </span>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    isLoading={isLoading}
                    className="w-full justify-center"
                  >
                    Sign In to CelebrAI
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-3">
                <CardTitle>Register Account</CardTitle>
                <CardDescription>
                  Create your profile to start orchestrating AI-powered events.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kavita Singhania"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Planning Role</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 bg-white"
                      >
                        <option value="Event Host / Couple">Event Host / Couple</option>
                        <option value="Professional Event Planner">Professional Event Planner</option>
                        <option value="Corporate Event Director">Corporate Event Director</option>
                        <option value="Vendor / Partner Specialist">Vendor / Partner Specialist</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="kavita@celebrations.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={regAgreed}
                      onChange={(e) => setRegAgreed(e.target.checked)}
                      className="mt-1 h-3.5 w-3.5 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
                      I agree to statutory local guidelines, municipal sound curfews, and CelebrAI terms.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={!regAgreed}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Account & Start Planning
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col border-t border-slate-100 bg-slate-50/50 p-4 text-center text-xs text-slate-500 space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Zero-Unconstrained AI Output Guarantee</span>
            </div>
            <p className="text-[11px]">
              Every plan complies with strict Zod validation schemas & mathematical budget conservation.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
