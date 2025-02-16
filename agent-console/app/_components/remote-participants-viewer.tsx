import { ObservableWrapper } from "@/components/observable-wrapper";
import { RecAvatar } from "@/components/rec-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLivekitParticipantState, useLivekitState } from "@/hooks/use-livekit/use-livekit-state";
import { withExcludedKeys, withIncludedKeys } from "@/lib/utils";
import { RemoteParticipant } from "livekit-client";
import { useState } from "react";
import { ParticipantTrackViewer } from "./participant-track-viewer";
import { ParticipantViewer } from "./participant-viewer";

export const RemoteParticipantsViewer = () => {
  const {
    remoteParticipants: { remoteParticipants, activeSpeakerIdentities },
  } = useLivekitState();

  const [selectedParticipant, setSelectedParticipant] = useState<RemoteParticipant | undefined>(
    undefined
  );

  const remoteParticipantIdentities = remoteParticipants.map((p) => p.identity);

  return (
    <div className="flex flex-col gap-4">
      {remoteParticipantIdentities.length > 0 ? (
        <Tabs
          defaultValue={remoteParticipantIdentities[0]}
          onValueChange={(value) => {
            setSelectedParticipant(remoteParticipants.find((p) => p.identity === value));
          }}
        >
          <TabsList className="h-auto px-3.5 py-3 gap-3.5">
            {remoteParticipantIdentities.map((identity) => (
              <TabsTrigger key={identity} value={identity} className="p-0">
                <RecAvatar
                  name={identity}
                  isSpeaking={activeSpeakerIdentities.includes(identity)}
                  isSelected={identity === selectedParticipant?.identity}
                />
              </TabsTrigger>
            ))}
          </TabsList>
          {remoteParticipantIdentities.map((identity) => (
            <TabsContent key={identity} value={identity} className="flex flex-col gap-4">
              <RemoteParticipantTile
                participant={remoteParticipants.find((p) => p.identity === identity)!}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center text-sm text-muted-foreground">No remote participants</div>
      )}
    </div>
  );
};

const RemoteParticipantTile = ({ participant }: { participant: RemoteParticipant }) => {
  const participantState = useLivekitParticipantState(participant);
  return (
    <>
      <ObservableWrapper
        title="Participant State"
        subtitle={participant.identity}
        state={withExcludedKeys(participantState, ["tracks"])}
      >
        {(state) => <ParticipantViewer {...state} />}
      </ObservableWrapper>
      <ObservableWrapper
        title="Participant Tracks"
        subtitle={participant.identity}
        state={withIncludedKeys(participantState, ["tracks"])}
      >
        {(state) => <ParticipantTrackViewer {...state} />}
      </ObservableWrapper>
    </>
  );
};
