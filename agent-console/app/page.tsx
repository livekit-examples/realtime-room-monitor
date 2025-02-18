"use client";

import LK from "@/components/lk";
import { ThemeSwitch } from "@/components/theme-switch";
import { useConnectionDetails } from "@/hooks/use-livekit";
import {
  AgentState,
  BarVisualizer,
  LiveKitRoom,
  useVoiceAssistant,
} from "@livekit/components-react";
import { MediaDeviceFailure } from "livekit-client";
import { useEffect } from "react";
import { ConsoleContainer } from "./_components/console-container";

export default function Page() {
  const { connectionDetails, updateConnectionDetails } = useConnectionDetails();

  return (
    <main className="h-full w-full bg-accent">
      <LiveKitRoom
        className="w-full h-full flex flex-col"
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined);
        }}
      >
        {/* <SimpleVoiceAssistant onStateChange={setAgentState} />
        <ControlBar onConnectButtonClicked={onConnectButtonClicked} agentState={agentState} />
        <NoAgentNotification state={agentState} /> */}
        {/* Header */}
        <div className="flex flex-row justify-between p-3 px-2 pb-1">
          <LK />
          <ThemeSwitch />
        </div>
        <div className="flex-1 p-2">
          <ConsoleContainer className="h-full shadow-sm rounded-md bg-background" />
        </div>
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onStateChange: (state: AgentState) => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);
  return (
    <div className="h-[300px] max-w-[90vw] mx-auto">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}
