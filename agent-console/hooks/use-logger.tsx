import { EventRegistry, eventRegistry } from "@/lib/event-definitions";
import { createEventRegistry } from "@/lib/event-registry";

export const { useLogger, renderEventLog, getEventLevel, getEventMessage } =
  createEventRegistry<EventRegistry>(eventRegistry);
