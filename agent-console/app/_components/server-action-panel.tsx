import { ActionCard } from "@/components/action-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLivekitAction, useLivekitState } from "@/hooks/use-livekit";
import { TabValue, useTabs } from "@/hooks/use-tabs";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

const RoomActionPanel = () => {
  const { room } = useLivekitState();
  const { updateRoomMetadata } = useLivekitAction();
  const [metadataInput, setMetadataInput] = useState(room.metadata || "");

  return (
    <ActionCard
      title="Update Room Metadata"
      description="Modify the metadata associated with this room"
      action={async () => {
        if (!room.name) throw new Error("No active room connection");
        return updateRoomMetadata({
          roomName: room.name,
          metadata: metadataInput,
        });
      }}
      className="m-4"
      disabled={!metadataInput || metadataInput === room.metadata}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="room-metadata">New Metadata</Label>
          <Input
            id="room-metadata"
            value={metadataInput}
            onChange={(e) => setMetadataInput(e.target.value)}
            placeholder="Enter metadata (JSON recommended)"
          />
        </div>
        {room.metadata && (
          <div className="text-sm text-muted-foreground">Current metadata: {room.metadata}</div>
        )}
      </div>
    </ActionCard>
  );
};

const ParticipantActionPanel = () => {
  const { localParticipant, room } = useLivekitState();
  const { updateParticipant } = useLivekitAction();
  const [metadataInput, setMetadataInput] = useState("");
  const [permissions, setPermissions] = useState({
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return (
    <div className="space-y-6 p-4">
      <ActionCard
        title="Update Local Participant"
        description="Modify participant permissions and metadata"
        action={async () => {
          if (!localParticipant) throw new Error("No participant selected");
          return updateParticipant({
            roomName: room.name,
            identity: localParticipant.identity as string,
            options: {
              metadata: metadataInput,
              permission: permissions,
            },
          });
        }}
        disabled={!metadataInput}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Participant Identity</Label>
            <Input
              value={localParticipant.identity as string}
              disabled
              placeholder="Select participant first"
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canPublish"
                  checked={permissions.canPublish}
                  onCheckedChange={(c) => setPermissions((p) => ({ ...p, canPublish: !!c }))}
                />
                <Label htmlFor="canPublish">Can Publish</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canSubscribe"
                  checked={permissions.canSubscribe}
                  onCheckedChange={(c) => setPermissions((p) => ({ ...p, canSubscribe: !!c }))}
                />
                <Label htmlFor="canSubscribe">Can Subscribe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="canPublishData"
                  checked={permissions.canPublishData}
                  onCheckedChange={(c) => setPermissions((p) => ({ ...p, canPublishData: !!c }))}
                />
                <Label htmlFor="canPublishData">Can Send Data</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Metadata</Label>
            <Input
              value={metadataInput}
              onChange={(e) => setMetadataInput(e.target.value)}
              placeholder="Enter participant metadata"
            />
          </div>
        </div>
      </ActionCard>
    </div>
  );
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
    <div className={cn("h-full flex flex-col bg-background", className)} {...rest}>
      <div className="p-4 pt-5 border-b">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {selectedTabLabels[selectedTab]}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{selectedTabDescriptions[selectedTab]}</p>
      </div>
      <ScrollArea>
        <Panel />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
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
