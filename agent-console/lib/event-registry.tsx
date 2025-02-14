import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type EventRenderer<T extends Record<string, unknown>> = (data: T) => React.ReactNode;

interface EventDefinition<T extends object> {
  color: string;
  render?: EventRenderer<T>;
}

export function createEventRegistry<T extends Record<string, EventDefinition<object>>>(config: T) {
  type EventKey = keyof T;
  type EventData<K extends EventKey> = T[K] extends EventDefinition<infer D> ? D : never;

  interface LogEntry<K extends EventKey> {
    timestamp: Date;
    eventType: K;
    data: EventData<K>;
  }

  interface LoggerState {
    logs: LogEntry<EventKey>[];
    log: <K extends EventKey>(type: K, data: EventData<K>) => void;
    clear: () => void;
    filter: (query: string) => LogEntry<EventKey>[];
  }

  const useStore = create<LoggerState>()(
    persist(
      (set, get) => ({
        logs: [],
        log: (type, data) =>
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
      }),
      {
        name: "event-registry-storage",
        partialize: (state) => ({ logs: state.logs }),
        version: 1,
      }
    )
  );

  return {
    useLogger: useStore,
    events: config,
  };
}
