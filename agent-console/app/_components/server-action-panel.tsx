import { useLivekitState } from "@/hooks/use-livekit";
import { TabValue, useTabs } from "@/hooks/use-tabs";
import { useMemo } from "react";

const RoomActionPanel = () => {
  return <div>RoomActionPanel</div>;
};

const ParticipantActionPanel = () => {
  return <div>ParticipantActionPanel</div>;
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
  const {
    localParticipant,
    remoteParticipants: { remoteParticipants },
  } = useLivekitState();
  const { selectedTab } = useTabs();
  //   const { muteTrack, removeParticipant, sendData, updateRoomMetadata, updateParticipant } =
  //     useLivekitAction();

  //   const allParticipants = useMemo(() => {}, [localParticipant, remoteParticipants]);
  const Panel = useMemo(() => tabValueToPanelMap[selectedTab], [selectedTab]);

  return <Panel />;
};
