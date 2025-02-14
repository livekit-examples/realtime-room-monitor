import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { getEventColor, renderEventLog, useLogger } from "@/hooks/use-logger";
import { EventType } from "@/lib/event-types";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export const ConsoleContainer = () => {
  const { logs, appendLog, clear } = useLogger();
  const [query, setQuery] = useState("");

  const filteredLogs = logs.filter((log) => {
    const logMessage = JSON.stringify(log.data);
    return logMessage.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    appendLog(EventType.System_ParticipantConnected, {
      id: "123",
      name: "John Doe",
    });

    appendLog(EventType.System_ParticipantDisconnected, {
      id: "123",
    });
  }, [appendLog]);

  return (
    <div className="w-full h-full flex flex-row">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="max-w-[700px] min-w-[300px] p-4">
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="Filter logs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="destructive" onClick={() => clear()} className="shrink-0">
              Clear Logs
            </Button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto space-y-2">
            {filteredLogs.map((logEntry, index) => {
              const displayName = logEntry.eventType
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/(^\w| \w)/g, (m) => m.toUpperCase());

              return (
                <div key={index} className="p-3 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(logEntry.timestamp)}
                    </span>
                    <code
                      className={cn("text-[0.75em] px-1.5 py-0.5 rounded", getEventColor(logEntry))}
                    >
                      #{displayName}
                    </code>
                  </div>
                  {renderEventLog(logEntry)}
                </div>
              );
            })}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>{/* Right panel content */}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
