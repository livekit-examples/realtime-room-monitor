import { defineEvent, renderJson } from "./event-registry";
import { EventLevel, EventSource, EventType } from "./event-types";

export interface ParticipantConnectionData {
  id: string;
  name: string;
}

export interface RoomConnectionData {
  name: string;
}

export const participantConnectedEvent = defineEvent<ParticipantConnectionData>({
  level: EventLevel.Info,
  source: EventSource.System,
  message: (data) => `Participant ${data.name} connected`,
  render: (data) => renderJson(data),
});

export const participantDisconnectedEvent = defineEvent<ParticipantConnectionData>({
  level: EventLevel.Error,
  source: EventSource.System,
  message: (data) => `Participant ${data.name} disconnected`,
  render: (data) => renderJson(data),
});

export const roomReconnectedEvent = defineEvent<RoomConnectionData>({
  level: EventLevel.Warn,
  source: EventSource.System,
  message: ({ name }) => `Room ${name} reconnected`,
  render: ({ name }) => renderJson({ name }),
});

export const eventRegistry = {
  [EventType.System_ParticipantConnected]: participantConnectedEvent,
  [EventType.System_ParticipantDisconnected]: participantDisconnectedEvent,
  [EventType.System_RoomDisconnected]: roomReconnectedEvent,
};

export type EventRegistry = typeof eventRegistry;
