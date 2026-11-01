import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

// ─── Shared PDF Design Tokens ─────────────────────────────────────────────────
export const COLORS = {
  primary: "#6C3FC5",
  secondary: "#F0EBFA",
  accent: "#E8B86D",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  white: "#FFFFFF",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
} as const;

export const FONTS = {
  heading: "Helvetica-Bold",
  body: "Helvetica",
  mono: "Courier",
} as const;

export const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  headerBand: {
    backgroundColor: COLORS.primary,
    marginHorizontal: -48,
    marginTop: -40,
    paddingHorizontal: 48,
    paddingVertical: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#D1C4E9",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primary,
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 9,
  },
  tableHeader: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flex: 1,
  },
  chip: {
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.textMuted,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    borderTopStyle: "solid",
    paddingTop: 6,
  },
});

// ─── Reusable Primitive Components ───────────────────────────────────────────

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function PageFooter({
  generatedAt,
  page,
}: {
  generatedAt: string;
  page: string;
}) {
  return (
    <View style={styles.footer} fixed>
      <Text>CelebrAI — Intelligent Event Planning</Text>
      <Text>
        Generated {new Date(generatedAt).toLocaleDateString("en-IN")} · Page {page}
      </Text>
    </View>
  );
}
