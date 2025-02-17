import { useLivekitState } from "@/hooks/use-livekit/use-livekit-state";
import { VideoTrack } from "@livekit/components-react";

/*
export type TrackReference = {
  participant: Participant;
  publication: TrackPublication;
  source: Track.Source;
};


 */

export const VideoConference = () => {
  const {
    tracks: { cameraTracks, screenShareTracks },
  } = useLivekitState();

  return (
    <>
      {cameraTracks.map((track) => (
        <div className="w-full h-full bg-red-500" key={track.publication.trackSid}>
          <VideoTrack className="w-full h-full bg-transparent" trackRef={track} />
        </div>
      ))}
      {screenShareTracks.map((track) => (
        <div className="w-full h-full bg-blue-500" key={track.publication.trackSid}>
          <VideoTrack className="w-full h-full bg-transparent" trackRef={track} />
        </div>
      ))}
    </>
  );
};
