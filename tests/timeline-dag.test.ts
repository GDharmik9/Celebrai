import { describe, it, expect } from "vitest";

interface DAGNode {
  id: string;
  title: string;
  durationDays: number;
  dependsOn: string[];
  dueDate: string;
}

/**
 * Validates DAG structure has no cycles and calculates topological order
 */
function topologicalSort(nodes: DAGNode[]): string[] {
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    graph.set(node.id, []);
  }

  for (const node of nodes) {
    for (const dep of node.dependsOn) {
      if (graph.has(dep)) {
        graph.get(dep)!.push(node.id);
        inDegree.set(node.id, (inDegree.get(node.id) ?? 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const neighbor of graph.get(current) ?? []) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== nodes.length) {
    throw new Error("Cycle detected in Timeline DAG!");
  }

  return order;
}

describe("Engine 2: Interactive Timeline DAG", () => {
  const sampleMilestones: DAGNode[] = [
    {
      id: "venue-lease",
      title: "Lock Palace Venue Lease",
      durationDays: 14,
      dependsOn: [],
      dueDate: "2026-06-15",
    },
    {
      id: "decor-procure",
      title: "Procure Master Decorator & Mandap Concept",
      durationDays: 20,
      dependsOn: ["venue-lease"],
      dueDate: "2026-08-01",
    },
    {
      id: "photo-contract",
      title: "Execute Candid Photography Contracts",
      durationDays: 10,
      dependsOn: ["venue-lease"],
      dueDate: "2026-08-20",
    },
    {
      id: "rsvp-lock",
      title: "Lock Final Guest RSVP Headcount",
      durationDays: 7,
      dependsOn: ["decor-procure"],
      dueDate: "2026-11-20",
    },
    {
      id: "day-of-loadin",
      title: "Mandap Floral Load-In & Audio Soundcheck",
      durationDays: 1,
      dependsOn: ["rsvp-lock"],
      dueDate: "2026-12-18",
    },
  ];

  it("should successfully execute topological sort without cycles", () => {
    const order = topologicalSort(sampleMilestones);
    expect(order).toHaveLength(5);
    // Root milestone must come first
    expect(order[0]).toBe("venue-lease");
    // Dependent milestones must appear after their prerequisites
    expect(order.indexOf("venue-lease")).toBeLessThan(order.indexOf("decor-procure"));
    expect(order.indexOf("decor-procure")).toBeLessThan(order.indexOf("rsvp-lock"));
    expect(order.indexOf("rsvp-lock")).toBeLessThan(order.indexOf("day-of-loadin"));
  });

  it("should detect and reject cyclic milestone dependencies", () => {
    const cyclicMilestones: DAGNode[] = [
      {
        id: "task-A",
        title: "Task A",
        durationDays: 5,
        dependsOn: ["task-B"],
        dueDate: "2026-07-01",
      },
      {
        id: "task-B",
        title: "Task B",
        durationDays: 5,
        dependsOn: ["task-A"], // Circular loop A -> B -> A
        dueDate: "2026-07-05",
      },
    ];

    expect(() => topologicalSort(cyclicMilestones)).toThrowError(/Cycle detected/);
  });
});

