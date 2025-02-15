"use client";
import { ObservableWrapper } from "@/components/observable-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WideSwitch } from "@/components/wide-switch";
import { getEventLevel, getEventMessage, useLogger } from "@/hooks/use-logger";
import { EventType } from "@/lib/event-types";
import { cn } from "@/lib/utils";
import { ControlBar as LivekitControlBar, useConnectionState } from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ConnectionButton } from "./connection-button";
import { LevelFilter } from "./level-filter";
import { LivekitStateTabs } from "./livekit-state-tabs";
import { LogItem } from "./log-item";
import { ParticipantViewer } from "./participant-viewer";
import { RoomStateViewer } from "./room-state-viewer";
export const ConsoleContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  const { logs, appendLog, clear } = useLogger();
  const [query, setQuery] = useState("");
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [controlBarExpanded, setControlBarExpanded] = useState<boolean>(false);

  // Level filter
  const [displayInfo, setDisplayInfo] = useState(true);
  const [displayWarn, setDisplayWarn] = useState(true);
  const [displayError, setDisplayError] = useState(true);

  const connectionState = useConnectionState();

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
    appendLog(EventType.System_ParticipantConnected, {
      id: "123",
      name: "John Doe",
    });

    appendLog(EventType.System_ParticipantDisconnected, {
      id: "123",
      name: "John Doed asdasdasd asdaasda sd",
    });

    appendLog(EventType.System_RoomDisconnected, {
      name: "Room 1",
    });
  }, [appendLog]);

  return (
    <div className={cn("w-full flex flex-row", className)} {...rest}>
      {typeof window === "undefined" ? null : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="py-4 min-w-[450px] max-w-[876px] flex flex-col">
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
            <div className="h-full flex flex-col">
              <div className="flex flex-col border-b p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 pr-3">
                    <h2 className="text-lg font-bold">LiveKit in Real Time</h2>
                    <p className="text-sm text-muted-foreground">
                      Maximize the observability of your Livekit room.
                    </p>
                  </div>
                  {/* Connection Button */}
                  <div className="inline-flex -space-x-px divide-x divide-primary-foreground/30 rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
                    <ConnectionButton className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10" />
                    <Button
                      className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                      size="icon"
                      aria-label="Options"
                      onClick={() => setControlBarExpanded(!controlBarExpanded)}
                    >
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        className={cn(
                          "transition-transform duration-300",
                          controlBarExpanded ? "rotate-180" : ""
                        )}
                      />
                    </Button>
                  </div>
                </div>
                <motion.div
                  animate={{ height: controlBarExpanded ? "auto" : 0 }}
                  initial={false}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {connectionState !== "disconnected" ? (
                      <motion.div
                        key="control-bar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <LivekitControlBar
                          className="border bg-muted rounded-md mt-4"
                          controls={{ leave: false }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-connection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center border bg-muted rounded-md p-4 mt-4 min-h-[68px]"
                      >
                        <p className="text-sm text-muted-foreground">
                          No connection to LiveKit server
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
              {/* <ControlBar className="m-4" /> */}
              {/* <ThemePicker /> */}
              {/* <VoiceAssistantControlBar controls={{ leave: false }} /> */}
              <LivekitStateTabs className="m-4" />
              <div className="flex-1 relative">
                <div className="absolute inset-0">
                  <ScrollArea className="h-full px-4">
                    <div className="flex flex-col py-4 gap-4">
                      <ObservableWrapper>
                        <RoomStateViewer />
                      </ObservableWrapper>
                      <ObservableWrapper>
                        <ParticipantViewer />
                      </ObservableWrapper>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};
