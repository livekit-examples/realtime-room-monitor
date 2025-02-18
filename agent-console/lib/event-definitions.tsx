import { defineEvent, renderJson } from "./event-registry";
import { EventLevel, EventSource, isAgent, RoomEventCallbackData } from "./event-types";

type RoomEventReturn<T extends keyof RoomEventCallbackData> = ReturnType<RoomEventCallbackData[T]>;

export const roomEventRegistry = {
  connected: defineEvent<RoomEventReturn<"connected">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "You are connected to the room",
  }),
  reconnecting: defineEvent<RoomEventReturn<"reconnecting">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "You are reconnecting to the room",
  }),
  signalReconnecting: defineEvent<RoomEventReturn<"signalReconnecting">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "You are reconnecting to the room",
  }),
  reconnected: defineEvent<RoomEventReturn<"reconnected">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "You have reconnected to the room",
  }),
  disconnected: defineEvent<RoomEventReturn<"disconnected">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ reason, code }) =>
      `You have disconnected from the room with code ${code} because "${reason}"`,
    render: ({ reason, code }) => renderJson({ reason, code }),
  }),
  connectionStateChanged: defineEvent<RoomEventReturn<"connectionStateChanged">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ state }) => `Your connection state has changed to ${state}`,
    render: ({ state }) => renderJson({ state }),
  }),
  mediaDevicesChanged: defineEvent<RoomEventReturn<"mediaDevicesChanged">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: "Your media devices have changed",
  }),
  participantConnected: defineEvent<RoomEventReturn<"participantConnected">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ participant }) =>
      isAgent(participant)
        ? `An agent "${participant.identity}" has joined the room`
        : `A new remote participant "${participant.identity}" has joined the room`,
    render: ({ participant }) => renderJson({ participant }),
  }),
  participantDisconnected: defineEvent<RoomEventReturn<"participantDisconnected">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ participant }) =>
      isAgent(participant)
        ? `An agent "${participant.identity}" has left the room`
        : `A remote participant "${participant.identity}" has left the room`,
    render: ({ participant }) => renderJson({ participant }),
  }),
  trackPublished: defineEvent<RoomEventReturn<"trackPublished">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ publication, participant }) =>
      isAgent(participant)
        ? `An agent "${participant.identity}" has published a ${publication.kind} track from ${publication.source} source`
        : `A remote participant "${participant.identity}" has published a ${publication.kind} track from ${publication.source} source`,
    render: ({ publication, participant }) => renderJson({ publication, participant }),
  }),
};

export type EventRegistry = typeof roomEventRegistry;
