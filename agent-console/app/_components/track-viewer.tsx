import { CollapsibleSection } from "@/components/collapsible-section";
import { JsonPreview } from "@/components/json-preview";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrackPublication } from "livekit-client";

export const TrackViewer = ({ track }: { track: TrackPublication }) => {
  const trackMetadata = {
    "Track ID": track.trackSid,
    "Track Name": track.trackName || undefined,
    Kind: track.kind,
    Source: track.source,
    "Stream ID": track.track?.mediaStream?.id,
    Bitrate: track.track?.currentBitrate
      ? `${Math.round(track.track.currentBitrate / 1000)} kbps`
      : undefined,
    Dimensions: track.dimensions
      ? `${track.dimensions.width}x${track.dimensions.height}`
      : undefined,
    "Muted State": track.isMuted,
    Encryption: track.isEncrypted,
    Simulcast: track.simulcasted,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-2 pb-0">
        {Object.entries(trackMetadata).map(([label, value]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{label}</span>
            {typeof value === "boolean" ? (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  value ? "bg-green-100/20 text-green-600" : "bg-red-100/20 text-red-600"
                )}
              >
                {value ? "Yes" : "No"}
              </Badge>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium truncate",
                  value === undefined && "text-muted-foreground italic"
                )}
              >
                {value === undefined ? "undefined" : value}
              </span>
            )}
          </div>
        ))}
      </div>

      <CollapsibleSection title="Technical Details" defaultExpanded={false}>
        <JsonPreview
          data={{
            sid: track.trackSid,
            name: track.trackName,
            kind: track.kind,
            source: track.source,
            muted: track.isMuted,
            encrypted: track.isEncrypted,
            simulcasted: track.simulcasted,
            bitrate: track.track?.currentBitrate,
            dimensions: track.dimensions,
            mediaStream: track.track?.mediaStream?.id,
          }}
          collapsed={1}
          displayDataTypes={false}
        />
      </CollapsibleSection>
    </div>
  );
};
