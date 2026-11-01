"use client";

import { useCallback, useState } from "react";
import type { Event, GeneratedTimeline } from "@celebrai/schemas";

interface TimelineState {
  timeline: GeneratedTimeline | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
}

export function useTimeline() {
  const [state, setState] = useState<TimelineState>({
    timeline: null,
    isLoading: false,
    error: null,
    progress: "",
  });

  const generate = useCallback(async (event: Event, horizonWeeks = 12) => {
    setState({ timeline: null, isLoading: true, error: null, progress: "Analyzing event details…" });

    try {
      setState((s) => ({ ...s, progress: "Building milestone DAG…" }));

      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, horizonWeeks }),
      });

      if (!res.ok) throw new Error(await res.text());

      setState((s) => ({ ...s, progress: "Finalizing critical path…" }));

      const data = await res.json() as { timeline: GeneratedTimeline };
      setState({
        timeline: data.timeline,
        isLoading: false,
        error: null,
        progress: "",
      });
    } catch (err) {
      setState({
        timeline: null,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to generate timeline",
        progress: "",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ timeline: null, isLoading: false, error: null, progress: "" });
  }, []);

  return { ...state, generate, reset };
}
