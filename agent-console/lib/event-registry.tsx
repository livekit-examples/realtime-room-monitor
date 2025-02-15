import { JsonPreview } from "@/components/json-preview";
import React from "react";
import { create } from "zustand";
import { EventLevel, EventSource } from "./event-types";
export type EventRenderer<T extends object> = (data: T) => React.ReactNode;

export interface EventDefinition<TData extends object> {
  level: EventLevel;
  source: EventSource;
  message: string | ((data: TData) => string);
  render: EventRenderer<TData>;
}

export function defineEvent<TData extends object>(definition: EventDefinition<TData>) {
  return definition;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEventRegistry<T extends Record<string, EventDefinition<any>>>(config: T) {
  type EventKey = keyof T;
  type EventData<K extends EventKey> = T[K] extends EventDefinition<infer D> ? D : never;

  interface LogEntry<K extends EventKey> {
    timestamp: Date;
    eventType: K;
    source: EventSource;
    data: EventData<K>;
  }

  interface LoggerState {
    logs: LogEntry<EventKey>[];
    appendLog: <K extends EventKey>(type: K, data: EventData<K>) => void;
    clear: () => void;
    filter: (query: string) => LogEntry<EventKey>[];
  }

  const getEventSourceByType = (type: EventKey) => {
    const eventDefinition = config[type];
    return eventDefinition.source;
  };

  const useStore = create<LoggerState>()(
    // persist(
    (set, get) => ({
      logs: [],
      appendLog: (type, data) =>
        set((state) => ({
          logs: [
            { timestamp: new Date(), eventType: type, data, source: getEventSourceByType(type) },
            ...state.logs,
          ],
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

  const getEventLevel = (log: LogEntry<EventKey>) => {
    const { eventType } = log;
    const eventDefinition = config[eventType];
    const { level } = eventDefinition;
    return level;
  };

  const getEventMessage = (log: LogEntry<EventKey>) => {
    const { eventType, data } = log;
    const eventDefinition = config[eventType];
    const { message } = eventDefinition;
    return typeof message === "function" ? message(data) : message;
  };

  return {
    useLogger: useStore,
    renderEventLog,
    getEventLevel,
    getEventMessage,
  };
}

export const renderJson = <T extends object>(data: T) => (
  <JsonPreview collapsed={2} displayDataTypes={false} data={data} />
);
