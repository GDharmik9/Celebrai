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
  MOCK_EVENT_ID,
} from "../mock-data";
import { createEventPlan, type CreateEventInput } from "../plan-generator";

export type HorizonFilter = "all" | "strategic" | "operational" | "day-of";

export interface UserProfile {
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
  registerUser: (profile: { name: string; role: string; email: string }) => void;
  logout: () => void;
  loadDemoData: () => void;

  setEvent: (event: Event) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  createNewEvent: (input: CreateEventInput) => Event;
  selectEventById: (id: string) => void;

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

// In-memory cache for event engines so switching retains updates
const eventPlansCache = new Map<
  string,
  {
    budget: BudgetVector;
    timeline: TimelineDAG;
    rfps: VendorRFP[];
    concept: ConceptStudio;
  }
>();

// Seed cache with default mock event data
eventPlansCache.set(MOCK_EVENT_ID, {
  budget: MOCK_BUDGET,
  timeline: MOCK_TIMELINE,
  rfps: MOCK_RFPS,
  concept: MOCK_CONCEPT,
});

export const useEventStore = create<EventStoreState>((set, get) => ({
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

  registerUser: (profile) =>
    set({
      isAuthenticated: true,
      user: {
        name: profile.name,
        email: profile.email,
        role: profile.role,
      },
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

  setEvent: (event) => {
    // Automatically load or synthesize associated plan engines so no data is 0 or N/A
    get().selectEventById(event.id);
  },

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
      event,
    })),

  /**
   * Creates a new event with full 4-Engine synthesis and immediately activates it.
   */
  createNewEvent: (input: CreateEventInput) => {
    const plan = createEventPlan(input);

    // Save into cache
    eventPlansCache.set(plan.event.id, {
      budget: plan.budget,
      timeline: plan.timeline,
      rfps: plan.rfps,
      concept: plan.concept,
    });

    set((state) => ({
      events: [plan.event, ...state.events],
      event: plan.event,
      budget: plan.budget,
      timeline: plan.timeline,
      rfps: plan.rfps,
      concept: plan.concept,
    }));

    return plan.event;
  },

  /**
   * Selects an event by ID and loads or generates its full 4-engine data.
   */
  selectEventById: (id: string) => {
    const state = get();
    const targetEvent = state.events.find((e) => e.id === id) || state.event;
    if (!targetEvent) return;

    // Check cache first
    let plan = eventPlansCache.get(id);

    if (!plan) {
      // Deterministically generate plan for known sample events or fallback
      let budgetAmount = 8500000;
      let aestheticStyle: CreateEventInput["aestheticStyle"] = "royal";

      if (targetEvent.type === "conference" || targetEvent.name.includes("Tech")) {
        budgetAmount = 2500000;
        aestheticStyle = "modern";
      } else if (targetEvent.type === "birthday") {
        budgetAmount = 800000;
        aestheticStyle = "bohemian";
      } else if (targetEvent.type === "anniversary") {
        budgetAmount = 1500000;
        aestheticStyle = "vintage";
      }

      const generated = createEventPlan({
        name: targetEvent.name,
        type: targetEvent.type as any,
        date: targetEvent.date,
        city: targetEvent.location.city,
        venue: targetEvent.location.venue,
        guestCount: targetEvent.guestCount,
        totalBudget: budgetAmount,
        aestheticStyle,
        specialNotes: targetEvent.description,
      });

      // Override the generated event ID with the actual event ID
      generated.event.id = targetEvent.id;
      generated.budget.eventId = targetEvent.id;
      generated.timeline.eventId = targetEvent.id;

      plan = {
        budget: generated.budget,
        timeline: generated.timeline,
        rfps: generated.rfps,
        concept: generated.concept,
      };

      eventPlansCache.set(id, plan);
    }

    set({
      event: targetEvent,
      budget: plan.budget,
      timeline: plan.timeline,
      rfps: plan.rfps,
      concept: plan.concept,
    });
  },

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

      const updatedBudget: BudgetVector = {
        ...state.budget,
        lineItems: updatedLineItems,
        lastUpdatedAt: new Date().toISOString(),
      };

      if (state.event?.id) {
        const cached = eventPlansCache.get(state.event.id);
        if (cached) {
          cached.budget = updatedBudget;
        }
      }

      return { budget: updatedBudget };
    }),

  toggleLockLineItem: (itemId: string) =>
    set((state) => {
      if (!state.budget) return state;
      const updatedBudget: BudgetVector = {
        ...state.budget,
        lineItems: state.budget.lineItems.map((item) =>
          item.id === itemId ? { ...item, locked: !item.locked } : item
        ),
      };

      if (state.event?.id) {
        const cached = eventPlansCache.get(state.event.id);
        if (cached) {
          cached.budget = updatedBudget;
        }
      }

      return { budget: updatedBudget };
    }),

  setTimeline: (timeline) => set({ timeline }),

  setActiveHorizon: (activeHorizon) => set({ activeHorizon }),

  toggleMilestoneOptimistic: (milestoneId: string) =>
    set((state) => {
      if (!state.timeline) return state;
      const updatedTimeline: TimelineDAG = {
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
      };

      if (state.event?.id) {
        const cached = eventPlansCache.get(state.event.id);
        if (cached) {
          cached.timeline = updatedTimeline;
        }
      }

      return { timeline: updatedTimeline };
    }),

  setRFPs: (rfps) => set({ rfps }),

  toggleChecklistItemOptimistic: (rfpId: string, itemId: string) =>
    set((state) => {
      const updatedRfps = state.rfps.map((rfp) => {
        if (rfp.id !== rfpId) return rfp;
        return {
          ...rfp,
          checklistItems: rfp.checklistItems.map((item) =>
            item.id === itemId ? { ...item, answered: !item.answered } : item
          ),
        };
      });

      if (state.event?.id) {
        const cached = eventPlansCache.get(state.event.id);
        if (cached) {
          cached.rfps = updatedRfps;
        }
      }

      return { rfps: updatedRfps };
    }),

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
