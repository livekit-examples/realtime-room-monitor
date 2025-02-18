import { ConnectionQuality, DataPacket_Kind } from "livekit-client";
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
  trackSubscribed: defineEvent<RoomEventReturn<"trackSubscribed">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ track, participant }) =>
      `${participant.identity} subscribed to ${track.source} track`,
    render: ({ track, publication, participant }) =>
      renderJson({ track, publication, participant }),
  }),
  trackSubscriptionFailed: defineEvent<RoomEventReturn<"trackSubscriptionFailed">>({
    level: EventLevel.Error,
    source: EventSource.Server,
    message: ({ trackSid, reason, participant }) =>
      `Track subscription from ${participant.identity} failed for ${trackSid}: ${reason}`,
    render: ({ trackSid, participant, reason }) => renderJson({ trackSid, participant, reason }),
  }),
  trackUnpublished: defineEvent<RoomEventReturn<"trackUnpublished">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ publication, participant }) =>
      `${participant.identity} unpublished ${publication.kind} track`,
    render: ({ publication, participant }) => renderJson({ publication, participant }),
  }),
  trackUnsubscribed: defineEvent<RoomEventReturn<"trackUnsubscribed">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ track, participant }) =>
      `Unsubscribed from ${track.source} track by ${participant.identity}`,
    render: ({ track, publication, participant }) =>
      renderJson({ track, publication, participant }),
  }),
  trackMuted: defineEvent<RoomEventReturn<"trackMuted">>({
    level: EventLevel.Warn,
    source: EventSource.Client,
    message: ({ publication, participant }) =>
      `${participant.identity} muted ${publication.kind} track`,
    render: ({ publication, participant }) => renderJson({ publication, participant }),
  }),
  trackUnmuted: defineEvent<RoomEventReturn<"trackUnmuted">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ publication, participant }) =>
      `${participant.identity} unmuted ${publication.kind} track`,
    render: ({ publication, participant }) => renderJson({ publication, participant }),
  }),
  localTrackPublished: defineEvent<RoomEventReturn<"localTrackPublished">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ publication }) =>
      `Published local ${publication.kind} track from ${publication.source}`,
    render: ({ publication, participant }) => renderJson({ publication, participant }),
  }),
  dataReceived: defineEvent<RoomEventReturn<"dataReceived">>({
    level: EventLevel.Info,
    source: EventSource.Server,
    message: ({ payload, kind, participant, topic }) =>
      `Received data packet (${DataPacket_Kind[kind!]}, ${payload.length} bytes) from ${
        participant?.identity
      } on topic ${topic}`,
    render: ({ payload, participant, kind, topic }) =>
      renderJson({ payload, participant, kind, topic }),
  }),
  chatMessage: defineEvent<RoomEventReturn<"chatMessage">>({
    level: EventLevel.Info,
    source: EventSource.Client,
    message: ({ message }) => `Chat: ${message.message}`,
    render: ({ message, participant }) => renderJson({ ...message, participant }),
  }),
  connectionQualityChanged: defineEvent<RoomEventReturn<"connectionQualityChanged">>({
    level: ({ quality }) =>
      quality === ConnectionQuality.Excellent ? EventLevel.Info : EventLevel.Warn,
    source: EventSource.Server,
    message: ({ quality, participant }) => `${participant.identity} connection quality: ${quality}`,
    render: ({ quality, participant }) => renderJson({ quality, participant }),
  }),
};

export type EventRegistry = typeof roomEventRegistry;
