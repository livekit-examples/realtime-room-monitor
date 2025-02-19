import { JsonPreview } from "@/components/json-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLivekitAction, useLivekitState } from "@/hooks/use-livekit";
import { TabValue, useTabs } from "@/hooks/use-tabs";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const RoomActionPanel = () => {
  const { room } = useLivekitState();
  const { updateRoomMetadata } = useLivekitAction();
  const [metadataInput, setMetadataInput] = useState(room.metadata || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [response, setResponse] = useState<object | null>(null);

  const handleUpdateMetadata = async () => {
    if (!room.name) {
      toast.error("No active room connection");
      return;
    }
    if (!metadataInput || metadataInput === room.metadata) return;

    toast.promise(
      async () => {
        setIsUpdating(true);
        const response = await updateRoomMetadata({
          roomName: room.name,
          metadata: metadataInput,
        });
        setResponse(response);
        return response;
      },
      {
        loading: "Updating room metadata...",
        success: () => {
          setMetadataInput("");
          return "Metadata updated successfully";
        },
        error: (error) => `Update failed: ${error.message}`,
        finally: () => setIsUpdating(false),
      }
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="room-metadata">Room Metadata</Label>
          <Input
            id="room-metadata"
            value={metadataInput}
            onChange={(e) => setMetadataInput(e.target.value)}
            placeholder="Enter metadata string"
            disabled={isUpdating}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleUpdateMetadata}
              disabled={isUpdating || !metadataInput || metadataInput === room.metadata}
            >
              {isUpdating ? "Updating..." : "Update Metadata"}
            </Button>
            {room.metadata && (
              <span className="text-sm text-muted-foreground">Current: {room.metadata}</span>
            )}
          </div>

          {response && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <JsonPreview title="Response" data={response} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantActionPanel = () => {
  return <div>ParticipantActionPanel</div>;
};

const RemoteParticipantActionPanel = () => {
  return <div>RemoteParticipantActionPanel</div>;
};

const VideoTrackActionPanel = () => {
  return <div>VideoTrackActionPanel</div>;
};

const tabValueToPanelMap: Record<TabValue, React.FC> = {
  room: RoomActionPanel,
  "local-participant": ParticipantActionPanel,
  "remote-participants": RemoteParticipantActionPanel,
  videos: VideoTrackActionPanel,
};

export const ServerActionPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  const { selectedTab } = useTabs();
  const Panel = useMemo(() => tabValueToPanelMap[selectedTab], [selectedTab]);

  return (
    <div className={cn("h-full flex flex-col bg-background p-6 space-y-6", className)} {...rest}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Room Administration Console</h2>
        <p className="text-sm text-muted-foreground">
          Manage participants, configure room settings, and monitor real-time metrics
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {selectedTabLabels[selectedTab]}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedTabDescriptions[selectedTab]}
            </p>
          </div>
          <Panel />
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">System Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <span className="text-base">🔄 Refresh State</span>
              <span className="text-xs text-muted-foreground font-normal">
                Force update all room metrics
              </span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2">
              <span className="text-base">🚫 Disconnect All</span>
              <span className="text-xs text-muted-foreground font-normal">
                Remove all participants
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const selectedTabLabels: Record<TabValue, string> = {
  room: "Room Configuration",
  "local-participant": "Local Participant Management",
  "remote-participants": "Remote Participant Controls",
  videos: "Video Track Operations",
};

const selectedTabDescriptions: Record<TabValue, string> = {
  room: "Update room metadata and global settings",
  "local-participant": "Manage local participant permissions and tracks",
  "remote-participants": "Control remote participants and their streams",
  videos: "Inspect and modify video track configurations",
};
