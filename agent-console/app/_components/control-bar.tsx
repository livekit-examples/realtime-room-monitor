import { cn } from "@/lib/utils";
import { useMediaDevices } from "@livekit/components-react";
import React from "react";
type ControlBarProps = React.HTMLAttributes<HTMLDivElement>;

export const ControlBar: React.FC<ControlBarProps> = ({ className, ...props }) => {
  const videoDevices = useMediaDevices({ kind: "videoinput" });
  const audioDevices = useMediaDevices({ kind: "audioinput" });
  const audioOutputDevices = useMediaDevices({ kind: "audiooutput" });

  return (
    <div className={cn("flex flex-row gap-4 p-4 bg-gray-100 rounded-lg", className)} {...props}>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-700">Video Devices</h3>
          <div className="flex flex-col gap-1">
            {videoDevices.map((device) => (
              <div
                key={device.deviceId}
                className="px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
              >
                {device.label || "Unnamed Device"}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-700">Audio Input Devices</h3>
          <div className="flex flex-col gap-1">
            {audioDevices.map((device) => (
              <div
                key={device.deviceId}
                className="px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
              >
                {device.label || "Unnamed Device"}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-700">Audio Output Devices</h3>
          <div className="flex flex-col gap-1">
            {audioOutputDevices.map((device) => (
              <div
                key={device.deviceId}
                className="px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50"
              >
                {device.label || "Unnamed Device"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// interface MediaDeviceInfo {
//   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/deviceId) */
//   readonly deviceId: string;
//   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/groupId) */
//   readonly groupId: string;
//   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/kind) */
//   readonly kind: MediaDeviceKind;
//   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/label) */
//   readonly label: string;
//   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/MediaDeviceInfo/toJSON) */
//   toJSON(): any;
// }
