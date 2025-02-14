import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WideSwitch } from "@/components/wide-switch";
import { getEventLevel, getEventMessage, renderEventLog, useLogger } from "@/hooks/use-logger";
import { EventLevel } from "@/lib/event-registry";
import { EventType } from "@/lib/event-types";
import { cn, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LevelFilter } from "./level-filter";

const getEventLevelColor = (level: EventLevel) => {
  switch (level) {
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "warn":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "error":
      return "bg-red-100 text-red-800 border-red-300";
  }
};

export const ConsoleContainer = () => {
  const { logs, appendLog, clear } = useLogger();
  const [query, setQuery] = useState("");
  const [expandAll, setExpandAll] = useState<boolean>(false);

  // Level filter
  const [displayInfo, setDisplayInfo] = useState(true);
  const [displayWarn, setDisplayWarn] = useState(true);
  const [displayError, setDisplayError] = useState(true);

  const numSelectedLevels = Object.values({
    displayInfo,
    displayWarn,
    displayError,
  }).filter(Boolean).length;

  const filteredLogs = logs.filter((log) => {
    const logMessage = JSON.stringify(log.data);
    return (
      (logMessage.toLowerCase().includes(query.toLowerCase()) &&
        displayInfo &&
        getEventLevel(log) === "info") ||
      (displayWarn && getEventLevel(log) === "warn") ||
      (displayError && getEventLevel(log) === "error")
    );
  });

  useEffect(() => {
    appendLog(EventType.System_ParticipantConnected, {
      id: "123",
      name: "John Doe",
    });

    appendLog(EventType.System_ParticipantDisconnected, {
      id: "123",
      name: "John Doe",
    });

    appendLog("system.participant_reconnected", {
      id: "123",
    });
  }, [appendLog]);

  return (
    <div className="w-full h-full flex flex-row">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4 min-w-[565px] max-w-[876px]">
          <div className="mb-4 flex items-center justify-between gap-2">
            <LevelFilter
              displayInfo={displayInfo}
              displayWarn={displayWarn}
              displayError={displayError}
              setDisplayInfo={setDisplayInfo}
              setDisplayWarn={setDisplayWarn}
              setDisplayError={setDisplayError}
              numSelectedLevels={numSelectedLevels}
            />
            <Input
              placeholder="Filter logs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <WideSwitch checked={expandAll} onCheckedChange={setExpandAll} />
                </TooltipTrigger>
                <TooltipContent className="dark px-2 py-1 text-xs">
                  {expandAll ? "Collapse all logs" : "Expand all logs"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="h-6 w-px bg-border" />
            <Button variant="destructive" onClick={() => clear()} className="h-9 px-4">
              Clear All
            </Button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto space-y-2">
            {filteredLogs.map((logEntry, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-3 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-16">
                    {formatDate(logEntry.timestamp)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      getEventLevelColor(getEventLevel(logEntry)),
                      "rounded-sm w-12 flex items-center justify-center mr-1.5"
                    )}
                  >
                    {getEventLevel(logEntry)}
                  </Badge>
                  <code className={cn("text-[0.75em] px-1.5 py-[2px] rounded")}>
                    {getEventMessage(logEntry)}
                  </code>
                </div>
                {expandAll && renderEventLog(logEntry)}
              </div>
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>{/* Right panel content */}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
