import { createEventRegistry } from "@/lib/event-registry";
import { EventType } from "@/lib/event-types";

// Define proper type for event data
interface ParticipantConnectedData {
  id: string;
  name?: string;
}

const { useLogger } = createEventRegistry({
  [EventType.System_ParticipantConnected]: {
    color: "bg-blue-100 text-blue-800",
    render: (data: ParticipantConnectedData) => (
      <div className="bg-blue-100 text-blue-800 p-2 rounded">
        <div>Participant Connected: {data.id}</div>
        {data.name && <div>Name: {data.name}</div>}
      </div>
    ),
  },
  [EventType.System_ParticipantDisconnected]: {
    color: "bg-red-100 text-red-800",
    render: (data: { id: string }) => (
      <div className="bg-red-100 text-red-800 p-2 rounded">
        <div>Participant Disconnected: {data.id}</div>
      </div>
    ),
  },
});

export default useLogger;
