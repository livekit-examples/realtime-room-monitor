"use client";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WideSwitch } from "@/components/wide-switch";
import { getEventLevel, getEventMessage, useLogger } from "@/hooks/use-logger";
import { EventType } from "@/lib/event-types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LevelFilter } from "./level-filter";
import { LogItem } from "./log-item";

export const ConsoleContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
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
    <div className={cn("w-full flex flex-row", className)} {...rest}>
      {typeof window === "undefined" ? null : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="py-4 min-w-[565px] max-w-[876px] flex flex-col">
            {/* Actions */}
            <div className="mb-4 px-4 flex items-center justify-between gap-2">
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
            {/* Logs */}
            <div className="flex-1 relative">
              <div className="absolute inset-0">
                <ScrollArea className="h-full">
                  {filteredLogs.map((logEntry, index) => (
                    <LogItem key={index} logEntry={logEntry} expandAll={expandAll} />
                  ))}
                </ScrollArea>
              </div>
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
