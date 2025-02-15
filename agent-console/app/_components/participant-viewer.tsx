import { CollapsibleSection } from "@/components/collapsible-section";
import { JsonPreview } from "@/components/json-preview";
import { MetricBadge } from "@/components/metric-badge";
import { MediaStatusBadge } from "@/components/metric-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivekitState } from "@/hooks/use-livekit";
import { cn, formatDate } from "@/lib/utils";
import {
  AlertCircle,
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  Video,
  VideoOff,
} from "lucide-react";

export const ParticipantViewer = () => {
  const { localParticipant } = useLivekitState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">Participant Details</span>
            <Badge variant="secondary" className="px-2 py-1">
              {localParticipant.identity}
            </Badge>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Joined:</span>
              <span className="font-mono">
                {formatDate(localParticipant.joinedAt ?? new Date())}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>Connection Quality:</span>
              <Badge
                variant="outline"
                className={cn(
                  "px-1.5 py-0.5 text-xs",
                  localParticipant.connectionQuality === "excellent"
                    ? "bg-green-500/15 text-green-700"
                    : localParticipant.connectionQuality === "good"
                    ? "bg-yellow-500/15 text-yellow-700"
                    : "bg-red-500/15 text-red-700"
                )}
              >
                {localParticipant.connectionQuality}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Media Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MediaStatusBadge
            enabled={localParticipant.isMicrophoneEnabled}
            enabledIcon={<Mic className="h-4 w-4" />}
            disabledIcon={<MicOff className="h-4 w-4" />}
            label="Microphone"
            enabledText="Active"
            disabledText="Muted"
          />
          <MediaStatusBadge
            enabled={localParticipant.isCameraEnabled}
            enabledIcon={<Video className="h-4 w-4" />}
            disabledIcon={<VideoOff className="h-4 w-4" />}
            label="Camera"
            enabledText="Active"
            disabledText="Off"
          />
          <MediaStatusBadge
            enabled={localParticipant.isScreenShareEnabled}
            enabledIcon={<ScreenShare className="h-4 w-4" />}
            disabledIcon={<ScreenShareOff className="h-4 w-4" />}
            label="Screen Share"
            enabledText="Sharing"
            disabledText="Inactive"
          />
        </div>

        {/* Technical Details */}
        <CollapsibleSection title="Track Publications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrackDetail title="Audio Tracks" tracks={localParticipant.audioTrackPublications} />
            <TrackDetail title="Video Tracks" tracks={localParticipant.videoTrackPublications} />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Participant Metadata">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JsonPreview title="Attributes" data={localParticipant.attributes} />
            <JsonPreview title="Metadata" data={localParticipant.metadata} />
          </div>
        </CollapsibleSection>

        {/* Connection Details */}
        <CollapsibleSection title="Connection Metrics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBadge
              label="Audio Level"
              value={Math.round(localParticipant.audioLevel * 100)}
              unit="%"
            />
            <MetricBadge label="Is Speaking" value={localParticipant.isSpeaking ? "Yes" : "No"} />
            <MetricBadge
              label="Last Spoke"
              value={
                localParticipant.lastSpokeAt ? formatDate(localParticipant.lastSpokeAt) : "N/A"
              }
            />
            <MetricBadge
              label="Permissions"
              value={localParticipant.permissions?.canPublish ? "Publisher" : "Listener"}
            />
          </div>
        </CollapsibleSection>

        {/* Error States */}
        {(localParticipant.lastMicrophoneError || localParticipant.lastCameraError) && (
          <div className="bg-red-100/20 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <h4 className="text-sm font-medium">Device Errors</h4>
            </div>
            {localParticipant.lastMicrophoneError && (
              <div className="text-sm">
                <span className="font-medium">Microphone:</span>{" "}
                {localParticipant.lastMicrophoneError.message}
              </div>
            )}
            {localParticipant.lastCameraError && (
              <div className="text-sm">
                <span className="font-medium">Camera:</span>{" "}
                {localParticipant.lastCameraError.message}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TrackDetail = ({
  title,
  tracks,
}: {
  title: string;
  tracks: Map<string, unknown> | undefined;
}) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium">{title}</h4>
    {tracks && Array.from(tracks.values()).length > 0 ? (
      <div className="space-y-1">
        {Array.from(tracks.values()).map((pub: any) => (
          <div key={pub.trackSid} className="p-2 text-xs bg-muted/30 rounded-md font-mono">
            {pub.trackName || pub.trackSid}
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="px-1.5 py-0.5">
                {pub.kind}
              </Badge>
              <Badge variant="outline" className="px-1.5 py-0.5">
                {pub.isMuted ? "Muted" : "Active"}
              </Badge>
              {pub.isEncrypted && (
                <Badge variant="outline" className="px-1.5 py-0.5">
                  Encrypted
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()}</div>
    )}
  </div>
);
