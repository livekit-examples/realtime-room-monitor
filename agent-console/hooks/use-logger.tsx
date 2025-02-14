import { createEventRegistry } from "@/lib/event-registry";
import { EventType } from "@/lib/event-types";

export const { useLogger, renderEventLog, getEventLevel, getEventMessage } = createEventRegistry({
  [EventType.System_ParticipantConnected]: {
    level: "info",
    message: (data: { name: string }) => `Participant ${data.name} connected`,
    render: ({ id, name }: { id: string; name: string }) => renderJson({ id, name }),
  },
  [EventType.System_ParticipantDisconnected]: {
    level: "error",
    message: (data: { name: string }) => `Participant ${data.name} disconnected`,
    render: ({ id, name }: { id: string; name: string }) => renderJson({ id, name }),
  },
  "system.participant_reconnected": {
    level: "warn",
    message: (data: { id: string }) => `Participant ${data.id} reconnected`,
    render: ({ id }: { id: string }) => renderJson({ id }),
  },
});

export const renderJson = (data: unknown) => (
  <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
    {typeof data === "object"
      ? JSON.stringify(data, null, 2)
      : JSON.stringify({ value: data }, null, 2)}
  </pre>
);
