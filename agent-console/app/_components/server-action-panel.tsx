import { useLivekitAction, useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";

export const ServerActionPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  const { localParticipant, remoteParticipants } = useLivekitState();
  const { muteTrack, removeParticipant, sendData, updateRoomMetadata, updateParticipant } =
    useLivekitAction();

  //   const allParticipants = useMemo(() => {}, [localParticipant, remoteParticipants]);

  return <div className={cn("h-full flex flex-col", className)} {...rest} />;
};
