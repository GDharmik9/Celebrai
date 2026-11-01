import EventPlanningWorkspacePage from "../new/page";
import { SAMPLE_EVENTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return SAMPLE_EVENTS.map((event) => ({
    id: event.id,
  }));
}

export default function EventDetailPage() {
  return <EventPlanningWorkspacePage />;
}

