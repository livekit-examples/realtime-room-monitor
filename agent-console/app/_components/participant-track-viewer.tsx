import { JsonPreview } from "@/components/json-preview";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LivekitParticipantState } from "@/hooks/use-livekit/use-livekit-state";
import { TrackPublication } from "livekit-client";
import { ChevronDown, Headphones, Mic, ScreenShare, Video } from "lucide-react";

type TrackCategory = {
  label: string;
  icon: React.ElementType;
  tracksKey: keyof LivekitParticipantState["tracks"];
  type: "audio" | "video" | "unknown";
};

const trackCategories: TrackCategory[] = [
  {
    label: "Microphone",
    icon: Mic,
    tracksKey: "microphoneTracks",
    type: "audio",
  },
  {
    label: "Camera",
    icon: Video,
    tracksKey: "cameraTracks",
    type: "video",
  },
  {
    label: "Screen Share",
    icon: ScreenShare,
    tracksKey: "screenShareTracks",
    type: "video",
  },
  {
    label: "Screen Audio",
    icon: Headphones,
    tracksKey: "screenShareAudioTracks",
    type: "audio",
  },
  {
    label: "Other",
    icon: ChevronDown,
    tracksKey: "unknownTracks",
    type: "unknown",
  },
];

export const ParticipantTrackViewer = ({ tracks }: Pick<LivekitParticipantState, "tracks">) => {
  return (
    <div className="w-full rounded-lg border bg-muted/30 p-4">
      <Tabs defaultValue="microphone">
        <TabsList className="grid w-full grid-cols-5">
          {trackCategories.map((category) => {
            const trackCount = tracks[category.tracksKey as keyof typeof tracks].length;
            return (
              <TabsTrigger
                key={category.label}
                value={category.label.toLowerCase()}
                className="flex items-center gap-2 text-xs"
                disabled={trackCount === 0}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
                {trackCount > 0 && (
                  <Badge className="ms-1.5 h-5 min-w-5" variant="secondary">
                    {trackCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {trackCategories.map((category) => {
          const categoryTracks = tracks[category.tracksKey as keyof typeof tracks].map(
            (track) => track.publication
          );

          return (
            <TabsContent key={category.label} value={category.label.toLowerCase()}>
              {categoryTracks.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No {category.label.toLowerCase()} tracks
                </div>
              ) : categoryTracks.length === 1 ? (
                <div className="p-2">
                  <JsonPreview
                    title={categoryTracks[0].trackName || "Unnamed Track"}
                    data={trackToJson(categoryTracks[0])}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {categoryTracks.map((track) => (
                    <Collapsible key={track.trackSid}>
                      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted/50 p-2 hover:bg-muted/80">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {track.trackName || track.trackSid}
                          </span>
                          <Badge variant="outline" className="h-5 px-1.5 py-0 text-xs">
                            {track.track?.kind}
                          </Badge>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-2">
                        <JsonPreview data={trackToJson(track)} />
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

const trackToJson = (track: TrackPublication) => ({
  sid: track.trackSid,
  name: track.trackName,
  kind: track.track?.kind,
  source: track.source,
  muted: track.isMuted,
  encrypted: track.isEncrypted,
  dimensions: track.dimensions,
  simulcasted: track.simulcasted,
  mediaStream: track.track?.mediaStream?.id,
});
