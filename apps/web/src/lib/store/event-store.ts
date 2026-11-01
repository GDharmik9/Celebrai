import { create } from "zustand";
import type {
  Event,
  BudgetVector,
  TimelineDAG,
  VendorRFP,
  ConceptStudio,
} from "@celebrai/schemas";
import {
  MOCK_EVENT,
  MOCK_BUDGET,
  MOCK_TIMELINE,
  MOCK_RFPS,
  MOCK_CONCEPT,
  SAMPLE_EVENTS,
} from "../mock-data";

export type HorizonFilter = "all" | "strategic" | "operational" | "day-of";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface EventStoreState {
  // Auth State
  isAuthenticated: boolean;
  user: UserProfile | null;

  // Master Event & Events Directory
  event: Event | null;
  events: Event[];

  // Engine 1: Budget State
  budget: BudgetVector | null;

  // Engine 2: Timeline DAG State
  timeline: TimelineDAG | null;
  activeHorizon: HorizonFilter;

  // Engine 3: Vendor RFPs & Checklists
  rfps: VendorRFP[];

  // Engine 4: Concept Studio
  concept: ConceptStudio | null;

  // Actions & Optimistic Dispatchers
  loginWithDemo: () => void;
  logout: () => void;
  loadDemoData: () => void;

  setEvent: (event: Event) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;

  setBudget: (budget: BudgetVector) => void;
  updateBudgetLineItemOptimistic: (itemId: string, newAmount: number) => void;
  toggleLockLineItem: (itemId: string) => void;

  setTimeline: (timeline: TimelineDAG) => void;
  setActiveHorizon: (horizon: HorizonFilter) => void;
  toggleMilestoneOptimistic: (milestoneId: string) => void;

  setRFPs: (rfps: VendorRFP[]) => void;
  toggleChecklistItemOptimistic: (rfpId: string, itemId: string) => void;

  setConcept: (concept: ConceptStudio) => void;
  resetAll: () => void;
}

export const useEventStore = create<EventStoreState>((set) => ({
  // Initialize with active demo session & pre-loaded wedding celebration
  isAuthenticated: true,
  user: {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "Event Host & Planner",
  },
  event: MOCK_EVENT,
  events: SAMPLE_EVENTS,
  budget: MOCK_BUDGET,
  timeline: MOCK_TIMELINE,
  activeHorizon: "all",
  rfps: MOCK_RFPS,
  concept: MOCK_CONCEPT,

  loginWithDemo: () =>
    set({
      isAuthenticated: true,
      user: {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        role: "Event Host & Planner",
      },
      event: MOCK_EVENT,
      events: SAMPLE_EVENTS,
      budget: MOCK_BUDGET,
      timeline: MOCK_TIMELINE,
      rfps: MOCK_RFPS,
      concept: MOCK_CONCEPT,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),

  loadDemoData: () =>
    set({
      event: MOCK_EVENT,
      events: SAMPLE_EVENTS,
      budget: MOCK_BUDGET,
      timeline: MOCK_TIMELINE,
      rfps: MOCK_RFPS,
      concept: MOCK_CONCEPT,
    }),

  setEvent: (event) => set({ event }),

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
      event,
    })),

  setBudget: (budget) => set({ budget }),

  /**
   * Optimistic budget slider update with sensitivity re-balancing.
   * Maintains invariant: sum(B_i) == totalBudget
   */
  updateBudgetLineItemOptimistic: (itemId: string, newAmount: number) =>
    set((state) => {
      if (!state.budget) return state;

      const items = [...state.budget.lineItems];
      const targetIndex = items.findIndex((i) => i.id === itemId);
      if (targetIndex === -1) return state;

      const currentItem = items[targetIndex]!;
      if (currentItem.locked) return state;

      const delta = newAmount - currentItem.estimatedAmount;
      const unlockedItems = items.filter(
        (i) => i.id !== itemId && !i.locked && i.estimatedAmount > 0
      );

      if (unlockedItems.length === 0) {
        return state;
      }

      const totalUnlocked = unlockedItems.reduce(
        (sum, item) => sum + item.estimatedAmount,
        0
      );

      // Distribute negative delta proportionally across unlocked items
      const updatedLineItems = items.map((item) => {
        if (item.id === itemId) {
          return { ...item, estimatedAmount: Math.max(0, newAmount) };
        }
        if (item.locked || item.estimatedAmount === 0) {
          return item;
        }
        const proportion = item.estimatedAmount / totalUnlocked;
        const adjustment = delta * proportion;
        const adjustedAmount = Math.max(0, Math.round(item.estimatedAmount - adjustment));
        return { ...item, estimatedAmount: adjustedAmount };
      });

      return {
        budget: {
          ...state.budget,
          lineItems: updatedLineItems,
          lastUpdatedAt: new Date().toISOString(),
        },
      };
    }),

  toggleLockLineItem: (itemId: string) =>
    set((state) => {
      if (!state.budget) return state;
      return {
        budget: {
          ...state.budget,
          lineItems: state.budget.lineItems.map((item) =>
            item.id === itemId ? { ...item, locked: !item.locked } : item
          ),
        },
      };
    }),

  setTimeline: (timeline) => set({ timeline }),

  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),

  toggleMilestoneOptimistic: (milestoneId: string) =>
    set((state) => {
      if (!state.timeline) return state;
      return {
        timeline: {
          ...state.timeline,
          milestones: state.timeline.milestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  completed: !m.completed,
                  completedAt: !m.completed ? new Date().toISOString() : undefined,
                }
              : m
          ),
        },
      };
    }),

  setRFPs: (rfps) => set({ rfps }),

  toggleChecklistItemOptimistic: (rfpId: string, itemId: string) =>
    set((state) => ({
      rfps: state.rfps.map((rfp) => {
        if (rfp.id !== rfpId) return rfp;
        return {
          ...rfp,
          checklistItems: rfp.checklistItems.map((item) =>
            item.id === itemId ? { ...item, answered: !item.answered } : item
          ),
        };
      }),
    })),

  setConcept: (concept) => set({ concept }),

  resetAll: () =>
    set({
      event: null,
      budget: null,
      timeline: null,
      activeHorizon: "all",
      rfps: [],
      concept: null,
    }),
}));
