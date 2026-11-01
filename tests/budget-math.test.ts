import { describe, it, expect } from "vitest";

interface LineItem {
  id: string;
  name: string;
  amount: number;
  locked: boolean;
}

/**
 * Mathematical budget invariant rebalancer function
 * Enforces: sum(B_i) = B_total
 */
function rebalanceBudget(
  items: LineItem[],
  targetId: string,
  newAmount: number,
  totalBudget: number
): LineItem[] {
  const targetIndex = items.findIndex((i) => i.id === targetId);
  if (targetIndex === -1 || items[targetIndex]!.locked) return items;

  const current = items[targetIndex]!;
  const delta = newAmount - current.amount;
  const unlockedOthers = items.filter(
    (i) => i.id !== targetId && !i.locked && i.amount > 0
  );

  if (unlockedOthers.length === 0) return items;

  const totalUnlocked = unlockedOthers.reduce((sum, i) => sum + i.amount, 0);

  const updated = items.map((item) => {
    if (item.id === targetId) {
      return { ...item, amount: Math.max(0, newAmount) };
    }
    if (item.locked || item.amount === 0) {
      return item;
    }
    const proportion = item.amount / totalUnlocked;
    const adjusted = Math.max(0, Math.round(item.amount - delta * proportion));
    return { ...item, amount: adjusted };
  });

  // Reconcile rounding differences to maintain exact sum equality
  const currentSum = updated.reduce((sum, i) => sum + i.amount, 0);
  const diff = totalBudget - currentSum;
  if (diff !== 0 && unlockedOthers.length > 0) {
    const firstUnlockedIndex = updated.findIndex(
      (i) => i.id !== targetId && !i.locked
    );
    if (firstUnlockedIndex !== -1) {
      updated[firstUnlockedIndex]!.amount = Math.max(
        0,
        updated[firstUnlockedIndex]!.amount + diff
      );
    }
  }

  return updated;
}

describe("Engine 1: Budget Conservation Invariant", () => {
  const TOTAL_BUDGET = 8500000; // ₹85 Lakhs

  const initialItems: LineItem[] = [
    { id: "venue", name: "Venue Lease", amount: 2200000, locked: true }, // Locked contract
    { id: "catering", name: "Catering Banquet", amount: 3300000, locked: false },
    { id: "decor", name: "Floral & Decor", amount: 1300000, locked: false },
    { id: "photo", name: "Photography & Cinema", amount: 850000, locked: false },
    { id: "buffer", name: "Buffer Reserve", amount: 850000, locked: false },
  ];

  it("should verify baseline budget perfectly equals total budget", () => {
    const initialSum = initialItems.reduce((acc, i) => acc + i.amount, 0);
    expect(initialSum).toBe(TOTAL_BUDGET);
  });

  it("should rebalance unlocked items when a category increases without changing locked items", () => {
    // Increase catering by ₹500,000 (from 3,300,000 to 3,800,000)
    const rebalanced = rebalanceBudget(initialItems, "catering", 3800000, TOTAL_BUDGET);

    // 1. Target increased
    const catering = rebalanced.find((i) => i.id === "catering");
    expect(catering?.amount).toBe(3800000);

    // 2. Locked item (Venue) remained strictly unchanged
    const venue = rebalanced.find((i) => i.id === "venue");
    expect(venue?.amount).toBe(2200000);

    // 3. Absolute invariant conservation: sum(B_i) === TOTAL_BUDGET
    const newSum = rebalanced.reduce((acc, i) => acc + i.amount, 0);
    expect(newSum).toBe(TOTAL_BUDGET);
  });

  it("should rebalance unlocked items when a category decreases", () => {
    // Decrease floral decor by ₹300,000
    const rebalanced = rebalanceBudget(initialItems, "decor", 1000000, TOTAL_BUDGET);

    const decor = rebalanced.find((i) => i.id === "decor");
    expect(decor?.amount).toBe(1000000);

    // Sum conservation holds
    const newSum = rebalanced.reduce((acc, i) => acc + i.amount, 0);
    expect(newSum).toBe(TOTAL_BUDGET);
  });

  it("should refuse to mutate a locked line item directly", () => {
    const rebalanced = rebalanceBudget(initialItems, "venue", 5000000, TOTAL_BUDGET);
    const venue = rebalanced.find((i) => i.id === "venue");
    expect(venue?.amount).toBe(2200000);
  });
});

