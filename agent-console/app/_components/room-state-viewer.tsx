import { Badge } from "@/components/ui/badge";
import { useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";
import { ConnectionState } from "livekit-client";

const getConnectionStateColor = (state: ConnectionState) => {
  switch (state) {
    case ConnectionState.Connected:
      return "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/20 hover:text-green-800 dark:hover:text-green-400";
    case ConnectionState.Connecting:
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-800 dark:hover:text-yellow-400";
    case ConnectionState.Disconnected:
      return "bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/20 hover:text-red-800 dark:hover:text-red-400";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400 hover:bg-gray-500/20 hover:text-gray-800 dark:hover:text-gray-400";
  }
};

export const RoomStateViewer = () => {
  const {
    room: { connectionState, name, metadata },
  } = useLivekitState();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Room State</h3>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Connection Status</div>
        <Badge
          className={cn(
            "px-2 py-1 font-medium cursor-pointer",
            getConnectionStateColor(connectionState)
          )}
        >
          {connectionState}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Room Name</div>
        {name && connectionState === "connected" ? (
          <div className="font-mono text-sm bg-muted/50 p-2 rounded-md">{name}</div>
        ) : (
          <div className="text-sm italic text-muted-foreground">Not connected</div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Metadata</div>
        {metadata ? (
          <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
            {JSON.stringify(JSON.parse(metadata), null, 2)}
          </pre>
        ) : (
          <div className="text-sm italic text-muted-foreground">No metadata available</div>
        )}
      </div>
    </div>
  );
};
