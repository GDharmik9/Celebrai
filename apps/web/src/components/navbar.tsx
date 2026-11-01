"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, CalendarDays, PlusCircle, LogIn, User, RefreshCw } from "lucide-react";
import { useEventStore } from "@/lib/store/event-store";
import { Button, Badge } from "@celebrai/ui";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, loginWithDemo, logout } = useEventStore();

  const navLinks = [
    { label: "Dashboard", href: "/events", icon: CalendarDays },
    { label: "Plan Event", href: "/events/new", icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-violet-800 text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Celebr<span className="text-violet-600">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
              v1.0
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth / Demo Profile Widget */}
        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                <span className="text-[10px] text-slate-500">{user.role}</span>
              </div>
              <Link
                href="/login"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700 ring-2 ring-violet-200 transition-transform hover:scale-105"
                title="Account Settings"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={loginWithDemo}
                className="hidden sm:inline-flex gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Demo Data
              </Button>
              <Link href="/login">
                <Button size="sm" className="gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

