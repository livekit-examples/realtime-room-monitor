import { CollapsibleSection } from "@/components/collapsible-section";
import { JsonPreview } from "@/components/json-preview";
import { MetricBadge } from "@/components/metric-badge";
import { Badge } from "@/components/ui/badge";
import { LivekitParticipantState } from "@/hooks/use-livekit/use-livekit-state";

import { cn, formatDate } from "@/lib/utils";
import { ConnectionQuality, TrackPublication } from "livekit-client";
import { AlertCircle } from "lucide-react";

const getConnectionQualityColor = (quality: ConnectionQuality) => {
  switch (quality) {
    case ConnectionQuality.Excellent:
      return "bg-green-500/15 text-green-700";
    case ConnectionQuality.Good:
      return "bg-yellow-500/15 text-yellow-700";
    case ConnectionQuality.Poor:
      return "bg-orange-500/15 text-orange-700";
    case ConnectionQuality.Lost:
      return "bg-red-500/15 text-red-700";
    default:
      return "bg-gray-500/15 text-gray-700";
  }
};

export const ParticipantViewer = ({
  identity,
  metadata,
  attributes,
  connectionQuality,
  isSpeaking,
  lastSpokeAt,
  audioLevel,
  permissions,
  errors,
}: Omit<LivekitParticipantState, "tracks" | "muted">) => {
  return (
    <div className="space-y-4">
      {/* Participant Metrics */}
      <CollapsibleSection title="Participant Metrics">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricBadge
            label="Identity"
            value={identity}
            className="bg-blue-100/20 text-blue-600 dark:text-blue-400"
          />
          <MetricBadge
            label="Connection Quality"
            value={connectionQuality}
            className={getConnectionQualityColor(connectionQuality)}
          />
          <MetricBadge
            label="Speaking"
            value={isSpeaking ? "Yes" : "No"}
            className={isSpeaking ? "bg-green-100/20 text-green-600" : "bg-red-100/20 text-red-600"}
          />
          <MetricBadge
            label="Audio Level"
            value={audioLevel ? Math.round(audioLevel * 100) : 0}
            unit="%"
            className="bg-purple-100/20 text-purple-600"
          />
          <MetricBadge
            label="Last Spoke"
            value={lastSpokeAt ? formatDate(lastSpokeAt) : "Never"}
            className="bg-orange-100/20 text-orange-600"
          />
        </div>
      </CollapsibleSection>

      {/* Metadata */}
      <CollapsibleSection title="Participant Metadata">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <JsonPreview title="Attributes" data={attributes} />
          <JsonPreview title="Metadata" data={metadata} />
        </div>
      </CollapsibleSection>

      {/* Permissions */}
      <CollapsibleSection title="Permissions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBadge label="Can Publish" value={permissions?.canPublish ? "Yes" : "No"} />
          <MetricBadge label="Can Subscribe" value={permissions?.canSubscribe ? "Yes" : "No"} />
          <MetricBadge
            label="Can Publish Data"
            value={permissions?.canPublishData ? "Yes" : "No"}
          />
          <MetricBadge label="Hidden" value={permissions?.hidden ? "Yes" : "No"} />
        </div>
      </CollapsibleSection>

      {/* Errors */}
      {(errors.lastMicrophoneError || errors.lastCameraError) && (
        <div className="bg-red-100/20 p-4 rounded-md space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <h4 className="text-sm font-medium">Device Errors</h4>
          </div>
          {errors.lastMicrophoneError && (
            <div className="text-sm">
              <span className="font-medium">Microphone:</span> {errors.lastMicrophoneError.message}
            </div>
          )}
          {errors.lastCameraError && (
            <div className="text-sm">
              <span className="font-medium">Camera:</span> {errors.lastCameraError.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MediaStatusBadge = ({
  enabled,
  muted,
  label,
  enabledIcon,
  disabledIcon,
}: {
  enabled: boolean;
  muted: boolean;
  label: string;
  enabledIcon: React.ReactNode;
  disabledIcon: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
    <div className={cn("p-1 rounded-full", enabled && !muted ? "text-green-600" : "text-red-600")}>
      {enabled ? enabledIcon : disabledIcon}
    </div>
    <span className="text-sm">{label}</span>
    <Badge
      variant="outline"
      className={cn("ml-auto", muted ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800")}
    >
      {muted ? "Muted" : "Active"}
    </Badge>
  </div>
);

const TrackPublicationGroup = ({
  title,
  tracks,
}: {
  title: string;
  tracks: TrackPublication[];
}) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium">{title}</h4>
    {tracks.length > 0 ? (
      <div className="space-y-1">
        {tracks.map((pub) => (
          <div key={pub.trackSid} className="p-2 text-xs bg-muted/30 rounded-md font-mono">
            <div className="flex justify-between items-center">
              <span>{pub.trackName || pub.trackSid}</span>
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {pub.track?.kind}
              </Badge>
            </div>
            <div className="mt-1 flex gap-2">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {pub.isMuted ? "Muted" : "Active"}
              </Badge>
              {pub.isEncrypted && (
                <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
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
