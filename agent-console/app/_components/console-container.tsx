"use client";
import { ThemePicker } from "@/components/theme-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WideSwitch } from "@/components/wide-switch";
import { getEventLevel, getEventMessage, renderEventLog, useLogger } from "@/hooks/use-logger";
import { EventLevel, EventSource } from "@/lib/event-registry";
import { EventType } from "@/lib/event-types";
import { cn, formatDate } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Server, Settings } from "lucide-react";
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

const getSourceIcon = (source: EventSource) => {
  const baseClass = "h-4 w-4 mr-2";
  switch (source) {
    case "server":
      return <ArrowDownCircle className={`${baseClass} text-green-600`} />;
    case "client":
      return <ArrowUpCircle className={`${baseClass} text-blue-600`} />;
    case "system":
      return <Settings className={`${baseClass} text-purple-600`} />;
    default:
      return <Server className={`${baseClass} text-gray-600`} />;
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
    const searchQuery = [
      getEventMessage(log),
      getEventLevel(log),
      log.eventType,
      JSON.stringify(log.data),
    ];

    const filtered = searchQuery.some((q) => q.toLowerCase().includes(query.toLowerCase()));
    const shouldDisplay =
      filtered &&
      ((displayInfo && getEventLevel(log) === "info") ||
        (displayWarn && getEventLevel(log) === "warn") ||
        (displayError && getEventLevel(log) === "error"));
    return shouldDisplay;
  });

  useEffect(() => {
    appendLog(
      EventType.System_ParticipantConnected,
      {
        id: "123",
        name: "John Doe",
      },
      "client"
    );

    appendLog(
      EventType.System_ParticipantDisconnected,
      {
        id: "123",
        name: "John Doed asdasdasd asdaasda sd",
      },
      "system"
    );

    appendLog(
      "system.participant_reconnected",
      {
        id: "123",
      },
      "server"
    );
  }, [appendLog]);

  return (
    <div className="w-full flex-1 flex flex-row" suppressHydrationWarning>
      {typeof window === "undefined" ? null : (
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
            <div className="h-[calc(100%-52px)] overflow-y-auto border rounded-lg shadow-sm">
              {filteredLogs.map((logEntry, index) => (
                <div key={index} className="flex flex-col gap-2 py-3 px-3 shadow-sm border-b">
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-12">
                      {formatDate(logEntry.timestamp)}
                    </span>
                    <div className="flex items-center w-18 mr-2">
                      {getSourceIcon(logEntry.source)}
                      <code className="text-xs font-medium text-muted-foreground">
                        {logEntry.source}
                      </code>
                    </div>
                    <code className={cn("text-[0.75em] px-1.5 py-[2px] rounded")}>
                      {getEventMessage(logEntry)}
                    </code>
                    <div className="flex-1" />
                    <Badge
                      variant="outline"
                      className={cn(
                        getEventLevelColor(getEventLevel(logEntry)),
                        "rounded-sm w-12 flex items-center justify-center"
                      )}
                    >
                      {getEventLevel(logEntry)}
                    </Badge>
                  </div>
                  {expandAll && renderEventLog(logEntry)}
                </div>
              ))}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="p-6 h-full flex flex-col gap-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold">Appearance Settings</h2>
                <p className="text-sm text-muted-foreground">Customize the interface appearance</p>
              </div>

              <div className="rounded-lg border bg-background p-6 shadow-sm bg-muted/30">
                <ThemePicker />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
