import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";
import { supportsScreenSharing, ToggleSource } from "@livekit/components-core";
import {
  CameraDisabledIcon,
  CameraIcon,
  ControlBarProps,
  MicDisabledIcon,
  MicIcon,
  ScreenShareIcon,
  ScreenShareStopIcon,
  useLocalParticipantPermissions,
  useMaybeRoomContext,
  useMediaDeviceSelect,
  usePersistentUserChoices,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import React from "react";

export const ControlBar = ({ controls, saveUserChoices = true, ...props }: ControlBarProps) => {
  const visibleControls = { leave: true, ...controls };
  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const browserSupportsScreenSharing = supportsScreenSharing();

  const {
    localParticipant: {
      tracks: { microphoneTracks, cameraTracks, screenShareTracks },
    },
  } = useLivekitState();

  const isMicrophoneEnabled = microphoneTracks.length > 0;
  const isCameraEnabled = cameraTracks.length > 0;
  const isScreenShareEnabled = screenShareTracks.length > 0;

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  return (
    <div {...props}>
      {visibleControls.microphone && (
        <MediaDeviceControl
          label="Microphone"
          source={Track.Source.Microphone}
          kind="audioinput"
          setDeviceEnabled={saveAudioInputEnabled}
          setDeviceId={saveAudioInputDeviceId}
          enabledIcon={MicIcon}
          disabledIcon={MicDisabledIcon}
        />
      )}
      {visibleControls.camera && (
        <MediaDeviceControl
          label="Camera"
          source={Track.Source.Camera}
          kind="videoinput"
          setDeviceEnabled={saveVideoInputEnabled}
          setDeviceId={saveVideoInputDeviceId}
          enabledIcon={CameraIcon}
          disabledIcon={CameraDisabledIcon}
        />
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <MediaDeviceControl
          label="Screen Share"
          source={Track.Source.ScreenShare}
          kind="videoinput"
          setDeviceEnabled={saveVideoInputEnabled}
          setDeviceId={saveVideoInputDeviceId}
          enabledIcon={ScreenShareIcon}
          disabledIcon={ScreenShareStopIcon}
        />
      )}
    </div>
  );
};

const MediaDeviceControl = <T extends ToggleSource>({
  label,
  source,
  kind,
  setDeviceEnabled,
  setDeviceId,
  enabledIcon: EnabledIcon,
  disabledIcon: DisabledIcon,
}: {
  label: string;
  source: T;
  kind: MediaDeviceKind;
  setDeviceEnabled: (enabled: boolean) => void;
  setDeviceId: (deviceId: string) => void;
  enabledIcon: React.ElementType;
  disabledIcon: React.ElementType;
}) => {
  const room = useMaybeRoomContext();
  const { buttonProps, enabled } = useTrackToggle({
    source,
    onChange: setDeviceEnabled,
  });
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    room,
    requestPermissions: true,
  });

  return (
    <div className="flex items-center gap-[1px] border rounded-md p-2">
      <Button
        {...buttonProps}
        className={cn(
          "h-9 min-w-[160px] transition-all",
          enabled ? "rounded-r-none pr-4" : "rounded-md"
        )}
      >
        <div className="flex items-center gap-2">
          {enabled ? (
            <EnabledIcon className="w-4 h-4 text-green-500 mr-2" />
          ) : (
            <DisabledIcon className="w-4 h-4 text-red-500 mr-2" />
          )}
          <span>{label}</span>
        </div>
      </Button>
      {enabled && (
        <Select
          value={activeDeviceId}
          onValueChange={(value) => {
            setActiveMediaDevice(value);
            setDeviceId(value);
          }}
        >
          <SelectTrigger className="bg-primary border-none text-primary-foreground rounded-l-none h-9 hover:bg-primary/80 transition-all duration-200 w-[300px]">
            <SelectValue placeholder="Select device" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
