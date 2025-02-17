import { RecAvatar } from "@/components/rec-avatar";
import { useLivekitState } from "@/hooks/use-livekit/use-livekit-state";
import { VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Mic, MicOff, ScreenShare, Video } from "lucide-react";

/*
export type TrackReference = {
  participant: Participant;
  publication: TrackPublication;
  source: Track.Source;
};


 */

const getTrackInfo = (trackRef: TrackReference) => ({
  participant: trackRef.participant,
  publication: trackRef.publication,
  source: trackRef.source,
  isScreenShare: trackRef.source === Track.Source.ScreenShare,
  isMuted: trackRef.publication.isMuted,
  participantName: trackRef.participant.identity,
  trackName: trackRef.publication.trackName || "Unnamed Track",
});

export const VideoConference = () => {
  const {
    tracks: { cameraTracks, screenShareTracks },
  } = useLivekitState();

  const allTracks = [...screenShareTracks, ...cameraTracks];

  return (
    <div className="h-full grid grid-cols-1 gap-4 p-4 bg-muted/10">
      {/* Screen Shares Section */}
      {screenShareTracks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
            <ScreenShare className="w-4 h-4" /> Screen Shares ({screenShareTracks.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {screenShareTracks.map((track) => {
              const info = getTrackInfo(track);
              return (
                <div
                  key={track.publication.trackSid}
                  className="relative aspect-video bg-background rounded-xl overflow-hidden border"
                >
                  <VideoTrack className="w-full h-full object-contain bg-black" trackRef={track} />
                  <TrackOverlay info={info} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Camera Feeds Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
          <Video className="w-4 h-4" /> Camera Feeds ({cameraTracks.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {cameraTracks.map((track) => {
            const info = getTrackInfo(track);
            return (
              <div
                key={track.publication.trackSid}
                className="relative aspect-video bg-background rounded-xl overflow-hidden border"
              >
                <VideoTrack className="w-full h-full object-contain" trackRef={track} />
                <TrackOverlay info={info} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {allTracks.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
          <Video className="w-8 h-8" />
          <p className="text-sm">No active video feeds</p>
        </div>
      )}
    </div>
  );
};

const TrackOverlay = ({ info }: { info: ReturnType<typeof getTrackInfo> }) => (
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
    <div className="flex items-center gap-3">
      <RecAvatar
        name={info.participantName}
        isSpeaking={info.participant.isSpeaking}
        isSelected={false}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-white flex items-center gap-2">
          {info.participantName}
          <span className="text-xs font-normal text-white/80">
            ({info.isScreenShare ? "Screen" : "Camera"})
          </span>
        </div>
        <div className="text-xs text-white/80 flex items-center gap-1.5">
          {info.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
          {info.trackName}
        </div>
      </div>
    </div>
  </div>
);
