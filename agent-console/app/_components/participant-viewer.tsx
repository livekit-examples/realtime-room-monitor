import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  Video,
  VideoOff,
} from "lucide-react";

export const ParticipantViewer = () => {
  const { localParticipant } = useLivekitState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Local Participant</span>
          <Badge variant="outline" className="px-2 py-1 text-sm">
            {localParticipant.identity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Media Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            {localParticipant.isMicrophoneEnabled ? (
              <Mic className="h-4 w-4 text-green-600" />
            ) : (
              <MicOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">Microphone</span>
            <Badge
              variant="outline"
              className={cn(
                "ml-auto",
                localParticipant.isMicrophoneEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {localParticipant.isMicrophoneEnabled ? "Active" : "Muted"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {localParticipant.isCameraEnabled ? (
              <Video className="h-4 w-4 text-green-600" />
            ) : (
              <VideoOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">Camera</span>
            <Badge
              variant="outline"
              className={cn(
                "ml-auto",
                localParticipant.isCameraEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {localParticipant.isCameraEnabled ? "Active" : "Off"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {localParticipant.isScreenShareEnabled ? (
              <ScreenShare className="h-4 w-4 text-green-600" />
            ) : (
              <ScreenShareOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-sm">Screen Share</span>
            <Badge
              variant="outline"
              className={cn(
                "ml-auto",
                localParticipant.isScreenShareEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {localParticipant.isScreenShareEnabled ? "Sharing" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Track Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Microphone Track</h4>
            {localParticipant.microphoneTrack ? (
              <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                {JSON.stringify(
                  {
                    id: localParticipant.microphoneTrack.trackId,
                    kind: localParticipant.microphoneTrack.kind,
                    muted: localParticipant.microphoneTrack.isMuted,
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="text-sm text-muted-foreground italic">No microphone track</div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Camera Track</h4>
            {localParticipant.cameraTrack ? (
              <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                {JSON.stringify(
                  {
                    id: localParticipant.cameraTrack.trackId,
                    kind: localParticipant.cameraTrack.kind,
                    muted: localParticipant.cameraTrack.isMuted,
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="text-sm text-muted-foreground italic">No camera track</div>
            )}
          </div>
        </div>

        {/* Error States */}
        {(localParticipant.lastMicrophoneError || localParticipant.lastCameraError) && (
          <div className="bg-red-100/20 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <h4 className="text-sm font-medium">Device Errors</h4>
            </div>

            {localParticipant.lastMicrophoneError && (
              <div className="text-sm text-red-600">
                Microphone Error: {localParticipant.lastMicrophoneError.message}
              </div>
            )}

            {localParticipant.lastCameraError && (
              <div className="text-sm text-red-600">
                Camera Error: {localParticipant.lastCameraError.message}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
