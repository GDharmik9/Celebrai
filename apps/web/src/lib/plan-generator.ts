import type {
  Event,
  BudgetVector,
  TimelineDAG,
  VendorRFP,
  ConceptStudio,
  Milestone,
} from "@celebrai/schemas";

export interface CreateEventInput {
  name: string;
  type: "wedding" | "birthday" | "corporate" | "conference" | "anniversary" | "festival" | "gala";
  date: string; // YYYY-MM-DD
  city: string;
  venue?: string | undefined;
  guestCount: number;
  totalBudget: number;
  aestheticStyle?: ("royal" | "modern" | "bohemian" | "vintage" | "glamorous" | "minimalist" | "garden" | "beachside") | undefined;
  specialNotes?: string | undefined;
}

export interface GeneratedPlan {
  event: Event;
  budget: BudgetVector;
  timeline: TimelineDAG;
  rfps: VendorRFP[];
  concept: ConceptStudio;
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function offsetDate(baseDateStr: string, daysOffset: number): string {
  try {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split("T")[0]!;
  } catch {
    return baseDateStr;
  }
}

/**
 * Deterministic 4-Engine Plan Generator.
 * Synthesizes Budget, 3-Horizon DAG Timeline, Vendor RFPs, and Concept Studio.
 * Strictly guarantees total budget conservation: sum(B_i) === totalBudget.
 */
export function createEventPlan(input: CreateEventInput): GeneratedPlan {
  const eventId = generateUUID();
  const eventDate = input.date;
  const now = new Date().toISOString();

  const event: Event = {
    id: eventId,
    name: input.name,
    type: input.type,
    date: input.date,
    location: {
      city: input.city,
      state: "India",
      country: "IN",
      venue: input.venue || `${input.city} Signature Lawns & Banquet`,
    },
    guestCount: Math.max(10, input.guestCount),
    description:
      input.specialNotes ||
      `AI-orchestrated ${input.type} celebration in ${input.city} for ${input.guestCount} guests with balanced budget and 3-horizon DAG scheduling.`,
    createdAt: now,
    updatedAt: now,
  };

  // --- ENGINE 1: Mathematically Conserved Budget Vector ---
  // Allocations calibrated by event type (percentages summing to 100%)
  const total = input.totalBudget;
  let allocations: Array<{
    category:
      | "venue"
      | "catering"
      | "decor"
      | "entertainment"
      | "photography"
      | "transportation"
      | "miscellaneous";
    label: string;
    pct: number;
    locked?: boolean;
    notes?: string;
  }>;

  if (input.type === "wedding") {
    allocations = [
      { category: "venue", label: "Palace / Banquet Venue Booking (3 Days)", pct: 0.26, locked: true, notes: "Advance deposit reserved." },
      { category: "catering", label: `Multi-Cuisine Royal Banquet (${input.guestCount} pax)`, pct: 0.36, notes: "Cocktail snacks & live gourmet counters." },
      { category: "decor", label: "Floral Styling, Mandap, Stage & Mood Lights", pct: 0.15, notes: "Thematic floral installations." },
      { category: "entertainment", label: "DJ, Sangeet Choreographer & Live Band", pct: 0.08, notes: "Sound permits compliant." },
      { category: "photography", label: "Cinematic Film Crew & Candid Photography", pct: 0.07, notes: "Drone footage & teaser edits." },
      { category: "miscellaneous", label: "Contingency Buffer & Statutory Permits", pct: 0.08, notes: "Curfew & sound clearance reserve." },
    ];
  } else if (input.type === "conference" || input.type === "corporate") {
    allocations = [
      { category: "venue", label: "Convention Hall & Breakout Rooms", pct: 0.35, locked: true, notes: "Wi-Fi & seating contracted." },
      { category: "catering", label: `Corporate Luncheon & Coffee Breaks (${input.guestCount} pax)`, pct: 0.25, notes: "Networking buffet." },
      { category: "entertainment", label: "High-Definition AV, LED Wall & Audio Rig", pct: 0.20, notes: "Live streaming & keynote AV." },
      { category: "decor", label: "Branding, Badges, Lanyards & Stage Backdrop", pct: 0.10, notes: "Sponsor signage." },
      { category: "miscellaneous", label: "Speaker Hospitality & Contingency Buffer", pct: 0.10, notes: "Reserve fund." },
    ];
  } else if (input.type === "birthday") {
    allocations = [
      { category: "venue", label: "Private Lounge / Terrace Venue Hire", pct: 0.25, locked: true, notes: "Exclusive hire." },
      { category: "catering", label: `Gourmet Food & Signature Cocktail Bar (${input.guestCount} pax)`, pct: 0.40, notes: "Customized mixology menu." },
      { category: "entertainment", label: "DJ, Sound System & Ambient Light Show", pct: 0.18, notes: "Curfew: 10:00 PM." },
      { category: "decor", label: "Bespoke Balloon Arch, Photo-Booth & Signage", pct: 0.10, notes: "Custom neon sign." },
      { category: "miscellaneous", label: "Custom Cake & Contingency Buffer", pct: 0.07, notes: "Emergency reserve." },
    ];
  } else {
    allocations = [
      { category: "venue", label: "Event Space & Grounds Reservation", pct: 0.30, locked: true },
      { category: "catering", label: `Banquet Dinner & Beverages (${input.guestCount} pax)`, pct: 0.35 },
      { category: "decor", label: "Ambiance Lighting, Floral & Spatial Decor", pct: 0.15 },
      { category: "entertainment", label: "Live Performer, Host & Acoustics", pct: 0.10 },
      { category: "miscellaneous", label: "Contingency Buffer", pct: 0.10 },
    ];
  }

  // Calculate integer amounts while strictly preserving sum(B_i) === totalBudget
  let accumulated = 0;
  const lineItems = allocations.map((alloc, idx) => {
    let amount: number;
    if (idx === allocations.length - 1) {
      amount = Math.max(0, total - accumulated);
    } else {
      amount = Math.round(total * alloc.pct);
      accumulated += amount;
    }

    return {
      id: generateUUID(),
      category: alloc.category,
      label: alloc.label,
      estimatedAmount: amount,
      actualAmount: alloc.locked ? amount : undefined,
      currency: "INR",
      notes: alloc.notes,
      locked: alloc.locked || false,
    };
  });

  const budget: BudgetVector = {
    eventId,
    totalBudget: total,
    currency: "INR",
    contingencyPercent: 10,
    version: 1,
    lastUpdatedAt: now,
    lineItems,
  };

  // --- ENGINE 2: 3-Horizon Backward-Scheduled DAG Timeline ---
  const mIds = {
    venueLock: generateUUID(),
    cateringRFP: generateUUID(),
    decorDesign: generateUUID(),
    invitationsSent: generateUUID(),
    menuTasting: generateUUID(),
    avSoundCheck: generateUUID(),
    rsvpCutoff: generateUUID(),
    finalRehearsal: generateUUID(),
    morningLoadIn: generateUUID(),
    soundCheckDay: generateUUID(),
    guestWelcoming: generateUUID(),
    mainCeremony: generateUUID(),
    postEventWrap: generateUUID(),
  };

  const milestones: Milestone[] = [
    // Horizon 1: Strategic (T-90 to T-45 days)
    {
      id: mIds.venueLock,
      title: "Contract Signed & Venue Deposit Locked",
      description: "Finalize venue contract, security deposits, and capacity confirmations.",
      dueDate: offsetDate(eventDate, -90),
      priority: "critical",
      category: "booking",
      dependsOn: [],
      completed: true,
      tags: ["strategic", "venue", "legal"],
    },
    {
      id: mIds.cateringRFP,
      title: "Catering Menu & Tasting Specifications Finalized",
      description: "Draft RFP requirements for guest dietary specifications and live stations.",
      dueDate: offsetDate(eventDate, -75),
      priority: "high",
      category: "vendor",
      dependsOn: [mIds.venueLock],
      completed: true,
      tags: ["strategic", "catering"],
    },
    {
      id: mIds.decorDesign,
      title: "Concept Studio Mood Board & Floral Signoff",
      description: "Approve 3D render designs, color hex coordinates, and lighting fixtures.",
      dueDate: offsetDate(eventDate, -60),
      priority: "high",
      category: "design",
      dependsOn: [mIds.venueLock],
      completed: false,
      tags: ["strategic", "decor"],
    },
    {
      id: mIds.invitationsSent,
      title: "Digital Invites Dispatched & RSVP Portal Live",
      description: "Send WhatsApp / email RSVP cards with hotel accommodation logistics.",
      dueDate: offsetDate(eventDate, -45),
      priority: "medium",
      category: "communication",
      dependsOn: [mIds.decorDesign],
      completed: false,
      tags: ["strategic", "guests"],
    },

    // Horizon 2: Operational (T-30 to T-7 days)
    {
      id: mIds.menuTasting,
      title: "Banquet Chef Tasting & Liquor License Clearances",
      description: "In-person menu walkthrough with executive chef; verify statutory excise clearances.",
      dueDate: offsetDate(eventDate, -25),
      priority: "high",
      category: "vendor",
      dependsOn: [mIds.cateringRFP],
      completed: false,
      tags: ["operational", "catering"],
    },
    {
      id: mIds.rsvpCutoff,
      title: "Final Guest Count Lock & Table Seating Plan",
      description: "Lock catering headcount guarantees; map VIP table chart.",
      dueDate: offsetDate(eventDate, -14),
      priority: "critical",
      category: "guest",
      dependsOn: [mIds.invitationsSent],
      completed: false,
      tags: ["operational", "logistics"],
    },
    {
      id: mIds.avSoundCheck,
      title: "Audio-Visual Acoustic Walkthrough & Curfew Verification",
      description: "Test wireless microphones, speaker zones, and sound limiter decibels.",
      dueDate: offsetDate(eventDate, -7),
      priority: "high",
      category: "rehearsal",
      dependsOn: [mIds.decorDesign],
      completed: false,
      tags: ["operational", "av"],
    },
    {
      id: mIds.finalRehearsal,
      title: "Run-of-Show Technical Dry Run",
      description: "Minute-by-minute rundown with emcee, DJ, and stage managers.",
      dueDate: offsetDate(eventDate, -2),
      priority: "critical",
      category: "rehearsal",
      dependsOn: [mIds.rsvpCutoff, mIds.avSoundCheck],
      completed: false,
      tags: ["operational", "run-of-show"],
    },

    // Horizon 3: Day-Of (T-12 hours to T+4 hours)
    {
      id: mIds.morningLoadIn,
      title: "Vendor Load-in & Floral Rigging Setup",
      description: "Stage build, floral arch erection, and backup generator power check.",
      dueDate: offsetDate(eventDate, 0),
      priority: "critical",
      category: "event-day",
      dependsOn: [mIds.finalRehearsal],
      completed: false,
      tags: ["day-of", "production"],
    },
    {
      id: mIds.soundCheckDay,
      title: "Final Acoustic & Ambient Lighting Tuning",
      description: "Pin-spot focusing, temperature balancing, and sound level test.",
      dueDate: offsetDate(eventDate, 0),
      priority: "high",
      category: "event-day",
      dependsOn: [mIds.morningLoadIn],
      completed: false,
      tags: ["day-of", "av"],
    },
    {
      id: mIds.guestWelcoming,
      title: "Red Carpet Arrival & Signature Welcome Cocktails",
      description: "Usher guests, coordinate welcome beverages, and play opening playlist.",
      dueDate: offsetDate(eventDate, 0),
      priority: "medium",
      category: "event-day",
      dependsOn: [mIds.soundCheckDay],
      completed: false,
      tags: ["day-of", "hospitality"],
    },
    {
      id: mIds.mainCeremony,
      title: "Main Celebration Keynote / Pheras / Cake Ceremony",
      description: "Primary milestone execution with spotlight coordination.",
      dueDate: offsetDate(eventDate, 0),
      priority: "critical",
      category: "event-day",
      dependsOn: [mIds.guestWelcoming],
      completed: false,
      tags: ["day-of", "highlight"],
    },
    {
      id: mIds.postEventWrap,
      title: "Teardown, Security Clearance & Vendor Payment Settlements",
      description: "Verify equipment packdown, security deposit release, and final vendor payments.",
      dueDate: offsetDate(eventDate, 1),
      priority: "high",
      category: "post-event",
      dependsOn: [mIds.mainCeremony],
      completed: false,
      tags: ["day-of", "finance"],
    },
  ];

  const timeline: TimelineDAG = {
    eventId,
    eventDate,
    planningStartDate: offsetDate(eventDate, -100),
    milestones,
    horizonWeeks: 14,
    criticalPath: [
      mIds.venueLock,
      mIds.cateringRFP,
      mIds.menuTasting,
      mIds.rsvpCutoff,
      mIds.finalRehearsal,
      mIds.morningLoadIn,
      mIds.mainCeremony,
      mIds.postEventWrap,
    ],
    version: 1,
    generatedAt: now,
  };

  // --- ENGINE 3: Vendor RFPs with Deliverables & Payment Triggers ---
  const rfps: VendorRFP[] = [
    {
      id: generateUUID(),
      eventId,
      vendor: {
        id: generateUUID(),
        name: `${input.city} Imperial Banquets & Caterers`,
        category: "catering",
        city: input.city,
        priceRange: "premium",
        rating: 4.9,
      },
      proposalDeadline: offsetDate(eventDate, -50),
      status: "contracted",
      generatedAt: now,
      checklistItems: [
        {
          id: generateUUID(),
          category: "pricing",
          question: `Fixed per-plate cost for ${input.guestCount} guests inclusive of taxes & live stalls?`,
          required: true,
          answered: true,
          answer: "Confirmed with unlimited live cocktail counters & dessert bar.",
        },
        {
          id: generateUUID(),
          category: "logistics",
          question: "FSSAI compliance certificate and kitchen waste management plan provided?",
          required: true,
          answered: true,
          answer: "FSSAI ISO-22000 certified with dedicated green-waste team.",
        },
        {
          id: generateUUID(),
          category: "payments",
          question: "Milestone payment schedule: 40% on tasting, 40% on setup, 20% on wrap?",
          required: true,
          answered: true,
          answer: "Payment schedule linked to DAG milestone IDs.",
        },
      ],
    },
    {
      id: generateUUID(),
      eventId,
      vendor: {
        id: generateUUID(),
        name: "Lumina Sonic Production & AV Rigging",
        category: "audio-visual",
        city: input.city,
        priceRange: "luxury",
        rating: 4.8,
      },
      proposalDeadline: offsetDate(eventDate, -40),
      status: "shortlisted",
      generatedAt: now,
      checklistItems: [
        {
          id: generateUUID(),
          category: "services",
          question: "Stage lighting trussing, wireless Shure mics, and line-array sound system provided?",
          required: true,
          answered: true,
          answer: "Full D&B Audiotechnik rig and Avolites lighting console reserved.",
        },
        {
          id: generateUUID(),
          category: "legal",
          question: "Compliance with local municipal noise curfew limits (10:00 PM cutoff)?",
          required: true,
          answered: false,
        },
      ],
    },
  ];

  // --- ENGINE 4: Concept Studio Sensory Palette ---
  const style = input.aestheticStyle || (input.type === "wedding" ? "royal" : input.type === "birthday" ? "bohemian" : "modern");

  const palettesByStyle: Record<string, ConceptStudio["colorPalette"]> = {
    royal: [
      { name: "Royal Mewar Violet", hex: "#6C3FC5", role: "primary" },
      { name: "Palace Gold Leaf", hex: "#E8B86D", role: "accent" },
      { name: "Deep Imperial Navy", hex: "#1A5276", role: "secondary" },
      { name: "Sandstone Ivory", hex: "#FAF8F5", role: "neutral" },
      { name: "Saffron Blossom", hex: "#E67E22", role: "accent" },
    ],
    modern: [
      { name: "Midnight Charcoal", hex: "#1E293B", role: "primary" },
      { name: "Electric Cyan", hex: "#06B6D4", role: "accent" },
      { name: "Titanium Silver", hex: "#94A3B8", role: "neutral" },
      { name: "Frosted Glass", hex: "#F8FAFC", role: "background" },
      { name: "Neon Violet", hex: "#8B5CF6", role: "secondary" },
    ],
    bohemian: [
      { name: "Terracotta Sunset", hex: "#C25E3E", role: "primary" },
      { name: "Warm Amber", hex: "#F59E0B", role: "accent" },
      { name: "Sage Eucalyptus", hex: "#6B7280", role: "secondary" },
      { name: "Pampa Cream", hex: "#FEF3C7", role: "neutral" },
      { name: "Dusty Rose", hex: "#E11D48", role: "accent" },
    ],
    vintage: [
      { name: "Antique Emerald", hex: "#065F46", role: "primary" },
      { name: "Champagne Pearl", hex: "#FDF4E3", role: "neutral" },
      { name: "Burnished Brass", hex: "#D97706", role: "accent" },
      { name: "Burgundy Velvet", hex: "#831843", role: "secondary" },
    ],
  };

  const chosenPalette = palettesByStyle[style] || palettesByStyle["royal"]!;

  const concept: ConceptStudio = {
    id: generateUUID(),
    eventId,
    title: `${input.name}: Sensory Vision`,
    description: `An immersive sensory curation for ${input.name} in ${input.city}, intertwining refined spatial lighting, signature mixology, and dynamic acoustics.`,
    primaryStyle: style as any,
    colorPalette: chosenPalette,
    moodKeywords: [
      "Curated",
      "Sophisticated",
      "Acoustic",
      "Luminous",
      "Memorable",
      "Bespoke",
      "Celebratory",
    ],
    inspirationUrls: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    ],
    venue: {
      indoorOutdoor: "both",
      setting: input.venue || `${input.city} Signature Lawns`,
      capacity: input.guestCount + 50,
    },
    florals: {
      style: "Organic architectural arrangements with seasonal blooms",
      flowers: ["White Jasmine", "Tuberose", "Marigold", "English Roses"],
      colors: chosenPalette.slice(0, 3).map((c) => c.hex),
    },
    lighting: {
      mood: "romantic",
      types: ["Warm amber ambient wash", "Pin-spots for stage", "Subtle fairy canopy"],
    },
    generatedAt: now,
  };

  return { event, budget, timeline, rfps, concept };
}

/**
 * Showcase Presets for 1-Click Instant AI Event Generation
 */
export const SHOWCASE_PRESETS: Array<{
  id: string;
  badge: string;
  name: string;
  type: CreateEventInput["type"];
  city: string;
  venue: string;
  guestCount: number;
  totalBudget: number;
  aestheticStyle: CreateEventInput["aestheticStyle"];
  description: string;
  date: string;
}> = [
  {
    id: "preset-jaipur-wedding",
    badge: "Most Popular",
    name: "Royal Jaipur Heritage Palace Wedding",
    type: "wedding",
    city: "Jaipur",
    venue: "Rambagh Palace Courtyard",
    guestCount: 450,
    totalBudget: 8500000,
    aestheticStyle: "royal",
    description: "3-day royal celebration with Sangeet night, floral mandap, and regal dining.",
    date: "2026-12-18",
  },
  {
    id: "preset-tech-summit",
    badge: "Enterprise",
    name: "TechNova Founders & AI Demo Day 2026",
    type: "conference",
    city: "Bengaluru",
    venue: "BIEC Grand Convention Hall",
    guestCount: 300,
    totalBudget: 2500000,
    aestheticStyle: "modern",
    description: "Keynotes, VIP investor banquet, product demos, and livestream AV rig.",
    date: "2026-11-25",
  },
  {
    id: "preset-beach-birthday",
    badge: "Trending",
    name: "Aarav's 25th Sunset Beach Club Celebration",
    type: "birthday",
    city: "Goa",
    venue: "Vagator Sunset Shore Club",
    guestCount: 80,
    totalBudget: 800000,
    aestheticStyle: "bohemian",
    description: "Sunset mixology, deep house DJ, bonfire, and seaside bohemian decor.",
    date: "2026-12-31",
  },
  {
    id: "preset-golden-anniversary",
    badge: "Classic",
    name: "The Singhania Golden 50th Jubilee Gala",
    type: "anniversary",
    city: "Mumbai",
    venue: "Taj Mahal Palace Ballroom",
    guestCount: 160,
    totalBudget: 1500000,
    aestheticStyle: "vintage",
    description: "Grand vintage jazz gala, nostalgic photo memory hall, and champagne dinner.",
    date: "2027-01-20",
  },
];
