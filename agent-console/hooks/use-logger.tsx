import { createEventRegistry } from "@/lib/event-registry";
import { EventType } from "@/lib/event-types";

export const { useLogger, renderEventLog, getEventLevel } = createEventRegistry({
  [EventType.System_ParticipantConnected]: {
    level: "info",
    render: ({ id, name }: { id: string; name?: string }) => renderJson({ id, name }),
  },
  [EventType.System_ParticipantDisconnected]: {
    level: "error",
    render: ({ id }: { id: string }) => renderJson({ id }),
  },
  "system.participant_reconnected": {
    level: "warn",
    render: ({ id }: { id: string }) => renderJson({ id }),
  },
});

export const renderJson = (data: unknown) => (
  <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
    <code className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
      {typeof data === "object"
        ? JSON.stringify(data, null, 2)
        : JSON.stringify({ value: data }, null, 2)}
    </code>
  </pre>
);
