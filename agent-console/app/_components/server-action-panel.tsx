import { ActionCard } from "@/components/action-card";
import { JsonEditor } from "@/components/json-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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

  // Name Update
  const [nameInput, setNameInput] = useState(localParticipant?.name || "");

  // Attributes Update
  const [attributes, setAttributes] = useState<[string, string][]>([]);
  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  // Metadata Update
  const [metadataInput, setMetadataInput] = useState(localParticipant?.metadata || "");

  // Permissions Update
  const [permissions, setPermissions] = useState({
    canSubscribe: localParticipant?.permissions?.canSubscribe ?? true,
    canPublish: localParticipant?.permissions?.canPublish ?? true,
    canPublishData: localParticipant?.permissions?.canPublishData ?? true,
    canUpdateMetadata: localParticipant?.permissions?.canUpdateMetadata ?? false,
    hidden: localParticipant?.permissions?.hidden ?? false,
  });

  return (
    <div className="space-y-6 p-4">
      {/* Name Update Card */}
      <ActionCard
        title="Update Participant Identity"
        description="Change the displayed name for this participant"
        action={async () => {
          if (!localParticipant) throw new Error("Participant not found");
          return updateParticipant({
            roomName: room.name,
            identity: localParticipant.identity as string,
            options: { name: nameInput },
          });
        }}
        disabled={!nameInput || nameInput === localParticipant?.name}
      >
        <div className="space-y-4">
          <Input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter new display name"
          />
          {localParticipant?.name && (
            <div className="text-sm text-muted-foreground">
              Current name: {localParticipant.name}
            </div>
          )}
        </div>
      </ActionCard>

      {/* Attributes Update Card */}
      <ActionCard
        title="Update Attributes"
        description="Manage key-value pairs for participant attributes"
        action={async () => {
          if (!localParticipant) throw new Error("Participant not found");
          const attributesObj = Object.fromEntries(attributes);
          return updateParticipant({
            roomName: room.name,
            identity: localParticipant.identity as string,
            options: { attributes: attributesObj },
          });
        }}
        disabled={attributes.length === 0}
      >
        <div className="space-y-4 bg-red-500">
          <JsonEditor />
        </div>
      </ActionCard>

      {/* Metadata Update Card */}
      <ActionCard
        title="Update Metadata"
        description="Modify participant metadata string"
        action={async () => {
          if (!localParticipant) throw new Error("Participant not found");
          return updateParticipant({
            roomName: room.name,
            identity: localParticipant.identity as string,
            options: { metadata: metadataInput },
          });
        }}
        disabled={!metadataInput || metadataInput === localParticipant?.metadata}
      >
        <div className="space-y-4">
          <Textarea
            value={metadataInput}
            onChange={(e) => setMetadataInput(e.target.value)}
            placeholder="Enter metadata (JSON recommended)"
            rows={4}
          />
          {localParticipant?.metadata && (
            <div className="text-sm text-muted-foreground">
              Current metadata: {localParticipant.metadata}
            </div>
          )}
        </div>
      </ActionCard>

      {/* Permissions Update Card */}
      <ActionCard
        title="Update Permissions"
        description="Modify participant permissions"
        action={async () => {
          if (!localParticipant) throw new Error("Participant not found");
          return updateParticipant({
            roomName: room.name,
            identity: localParticipant.identity as string,
            options: { permission: permissions },
          });
        }}
        disabled={JSON.stringify(permissions) === JSON.stringify(localParticipant?.permissions)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="canPublish"
              checked={permissions.canPublish}
              onCheckedChange={(c) => setPermissions((p) => ({ ...p, canPublish: !!c }))}
            />
            <Label htmlFor="canPublish">Can Publish Media</Label>
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="canUpdateMetadata"
              checked={permissions.canUpdateMetadata}
              onCheckedChange={(c) => setPermissions((p) => ({ ...p, canUpdateMetadata: !!c }))}
            />
            <Label htmlFor="canUpdateMetadata">Can Update Metadata</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hidden"
              checked={permissions.hidden}
              onCheckedChange={(c) => setPermissions((p) => ({ ...p, hidden: !!c }))}
            />
            <Label htmlFor="hidden">Hide Participant</Label>
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
