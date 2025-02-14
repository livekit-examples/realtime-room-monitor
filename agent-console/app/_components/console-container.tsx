import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useLogger } from "@/hooks/use-logger";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const ConsoleContainer = () => {
  const { logs, filter } = useLogger();
  const [query, setQuery] = useState("");

  const filteredLogs = filter(query);

  return (
    <div className="w-full h-full flex flex-row">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="max-w-[700px] min-w-[300px] p-4">
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Filter logs..."
              className="w-full p-2 border rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => useLogger.getState().clearLogs()}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
            >
              Clear
            </button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto space-y-2">
            {filteredLogs.map((log, index) => {
              const displayName = log.eventType
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/(^\w| \w)/g, (m) => m.toUpperCase());

              return (
                <div key={index} className="p-3 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        events[log.eventType]?.color || "bg-gray-100 text-gray-800"
                      )}
                    >
                      {displayName}
                    </span>
                  </div>
                  {events[log.eventType]?.render?.(log.data) || (
                    <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
                      {typeof log.data === "object"
                        ? JSON.stringify(log.data, null, 2)
                        : JSON.stringify({ value: log.data }, null, 2)}
                    </pre>
                  )}
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
