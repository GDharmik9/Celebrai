import Link from "next/link";
import { Sparkles, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 mb-4">
        <Sparkles className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page Not Found
      </h2>
      <p className="mt-2 text-base text-slate-500 max-w-md">
        The celebration plan or page you are looking for doesn't exist or has been relocated.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}

