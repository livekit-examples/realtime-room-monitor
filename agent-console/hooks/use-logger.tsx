import { EventRegistry, roomEventRegistry } from "@/lib/event-definitions";
import { createEventRegistry } from "@/lib/event-registry";

const registry = createEventRegistry<EventRegistry>(roomEventRegistry);

export const { useLogger, renderEventLog, getEventLevel, getEventMessage } = registry;

export type LogEntry = ReturnType<typeof useLogger.getState>["logs"][number];
