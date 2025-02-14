import React from "react";
import { create } from "zustand";

type EventRenderer<T extends object> = (data: T) => React.ReactNode;

interface EventDefinition<TData extends object> {
  color: string;
  render: EventRenderer<TData>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEventRegistry<T extends Record<string, EventDefinition<any>>>(config: T) {
  type EventKey = keyof T;
  type EventData<K extends EventKey> = T[K] extends EventDefinition<infer D> ? D : never;

  interface LogEntry<K extends EventKey> {
    timestamp: Date;
    eventType: K;
    data: EventData<K>;
  }

  interface LoggerState {
    logs: LogEntry<EventKey>[];
    appendLog: <K extends EventKey>(type: K, data: EventData<K>) => void;
    clear: () => void;
    filter: (query: string) => LogEntry<EventKey>[];
  }

  const useStore = create<LoggerState>()(
    // persist(
    (set, get) => ({
      logs: [],
      appendLog: (type, data) =>
        set((state) => ({
          logs: [{ timestamp: new Date(), eventType: type, data }, ...state.logs],
        })),
      clear: () => set({ logs: [] }),
      filter: (query) => {
        const q = query.toLowerCase();
        return get().logs.filter(
          (entry) =>
            entry.eventType.toString().toLowerCase().includes(q) ||
            JSON.stringify(entry.data).toLowerCase().includes(q)
        );
      },
    })
    // {
    //   name: "event-registry-storage",
    //   partialize: (state) => ({ logs: state.logs }),
    //   version: 1,
    // }
    // )
  );

  const renderEventLog = (log: LogEntry<EventKey>) => {
    const { eventType, data } = log;
    const eventDefinition = config[eventType];
    const { render } = eventDefinition;
    return render?.(data);
  };

  const getEventColor = (log: LogEntry<EventKey>) => {
    const { eventType } = log;
    const eventDefinition = config[eventType];
    const { color } = eventDefinition;
    return color;
  };

  return {
    useLogger: useStore,
    renderEventLog,
    getEventColor,
  };
}
