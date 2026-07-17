import { useLogger } from "@/hooks/use-logger";
import { EventRegistry, eventRegistryConfig } from "@/lib/event-definitions";
import { roomEventCallbackData, RoomEventCallbackData } from "@/lib/event-types";
import { useRoomContext } from "@livekit/components-react";
import { useEffect } from "react";

type InstrumentedEventType = keyof EventRegistry & keyof RoomEventCallbackData;
type InstrumentedEventParams = Parameters<RoomEventCallbackData[InstrumentedEventType]>;
type InstrumentedCallback = (...params: InstrumentedEventParams) => object;

const roomEventCallbackDataValues = Object.entries(roomEventCallbackData).filter(
  ([eventType]) => {
    return eventType in eventRegistryConfig;
  }
) as [InstrumentedEventType, InstrumentedCallback][];

interface LivekitEventInstrumentorProps {
  children: React.ReactNode;
}

export const LivekitEventInstrumentor = ({ children }: LivekitEventInstrumentorProps) => {
  const room = useRoomContext();
  const { appendLog } = useLogger();

  useEffect(() => {
    // ponytail: TS cannot correlate the eventType/callback union pair, so log through a widened signature
    const logEvent = appendLog as (eventType: InstrumentedEventType, data: object) => void;

    const roomEventCallbacks = roomEventCallbackDataValues.map(([eventType, callback]) => {
      const pipeDataToLogger = (...params: InstrumentedEventParams) => {
        const data = callback(...params);
        logEvent(eventType, data);
      };

      return {
        eventType,
        callback: pipeDataToLogger,
      };
    });

    roomEventCallbacks.forEach(({ eventType, callback }) => {
      console.log("eventType", eventType);
      room.on(eventType, callback);
    });

    return () => {
      roomEventCallbacks.forEach(({ eventType, callback }) => {
        room.off(eventType, callback);
      });
    };
  }, [room]);

  return children;
};
