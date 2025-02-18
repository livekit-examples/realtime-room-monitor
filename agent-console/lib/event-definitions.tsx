import { defineEvent } from "./event-registry";
import { EventLevel, EventSource, RoomEventCallbackData } from "./event-types";

type RoomEventReturn<T extends keyof RoomEventCallbackData> = ReturnType<RoomEventCallbackData[T]>;

export const roomEventRegistry = {
  connected: defineEvent<RoomEventReturn<"connected">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "Connected to room",
    render: () => "Connected to room",
  }),
  disconnected: defineEvent<RoomEventReturn<"disconnected">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "Disconnected from room",
    render: () => "Disconnected from room",
  }),
};

export type EventRegistry = typeof roomEventRegistry;
