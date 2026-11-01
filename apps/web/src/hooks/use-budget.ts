"use client";

import { useCallback, useOptimistic, useState, useTransition } from "react";
import type { BudgetVariance, BudgetVector } from "@celebrai/schemas";

interface BudgetState {
  budget: BudgetVector | null;
  variance: BudgetVariance | null;
  isLoading: boolean;
  error: string | null;
}

export function useBudget(initialBudget?: BudgetVector) {
  const [state, setState] = useState<BudgetState>({
    budget: initialBudget ?? null,
    variance: null,
    isLoading: false,
    error: null,
  });

  const [, startTransition] = useTransition();

  const [optimisticBudget, setOptimisticBudget] = useOptimistic(
    state.budget,
    (_current, newBudget: BudgetVector) => newBudget
  );

  const rebalance = useCallback(
    async (adjustmentRequest: string) => {
      if (!state.budget) return;

      setState((s) => ({ ...s, isLoading: true, error: null }));

      startTransition(() => {
        // Optimistic: show a version of the budget immediately while we wait
        if (state.budget) {
          setOptimisticBudget(state.budget);
        }
      });

      try {
        const res = await fetch("/api/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            budget: state.budget,
            adjustmentRequest,
          }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json() as { variance: BudgetVariance };
        setState((s) => ({
          ...s,
          variance: data.variance,
          isLoading: false,
        }));
      } catch (err) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    },
    [state.budget, setOptimisticBudget]
  );

  const updateBudget = useCallback((budget: BudgetVector) => {
    setState((s) => ({ ...s, budget, variance: null }));
  }, []);

  return {
    budget: optimisticBudget,
    variance: state.variance,
    isLoading: state.isLoading,
    error: state.error,
    rebalance,
    updateBudget,
  };
}
