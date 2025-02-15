import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";
import { ConnectionState } from "livekit-client";
import { ChevronDown } from "lucide-react";

const getConnectionStateColor = (state: ConnectionState) => {
  switch (state) {
    case ConnectionState.Connected:
      return "bg-green-500/15 text-green-700 dark:text-green-400";
    case ConnectionState.Connecting:
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
    case ConnectionState.Disconnected:
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-400";
  }
};

export const RoomStateViewer = () => {
  const { room } = useLivekitState();
  const { connectionState, name, metadata, connectionDetails, serverInfo } = room;

  const parsedMetadata = safeParseJSON(metadata);
  const serverDetails = {
    protocol: serverInfo?.protocol,
    region: serverInfo?.region,
    nodeId: serverInfo?.nodeId,
    version: serverInfo?.version,
  };

  const { serverUrl, participantName, participantToken } = connectionDetails;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">Room State</span>
            <Badge variant="secondary" className="px-2 py-1">
              {name || "Not connected"}
            </Badge>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <Badge
                variant="outline"
                className={cn("px-1.5 py-0.5 text-xs", getConnectionStateColor(connectionState))}
              >
                {connectionState}
              </Badge>
            </div>
            {serverInfo?.edition && (
              <div className="flex items-center gap-1">
                <span>Edition:</span>
                <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                  {serverInfo.edition}
                </Badge>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CollapsibleSection title="Connection Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <JsonPreview title="Room Metadata" data={parsedMetadata} />
            <JsonPreview
              title="Connection Configuration"
              data={{
                serverUrl,
                token: participantToken,
                participantIdentity: participantName,
              }}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Server Infrastructure">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricBadge label="Protocol" value={serverDetails.protocol} />
            <MetricBadge label="Region" value={serverDetails.region} />
            <MetricBadge label="Node ID" value={serverDetails.nodeId} />
            <MetricBadge label="Server Version" value={serverDetails.version} />
          </div>
        </CollapsibleSection>
      </CardContent>
    </Card>
  );
};

const safeParseJSON = (data?: string): unknown => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return { error: "Invalid JSON format", rawData: data };
  }
};

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Collapsible defaultOpen>
    <CollapsibleTrigger className="w-full flex items-center justify-between p-2 bg-muted/50 rounded-md">
      <span className="text-sm font-medium">{title}</span>
      <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
  </Collapsible>
);

const JsonPreview = ({ title, data }: { title: string; data: unknown }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-medium">{title}</h4>
    {data ? (
      <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    ) : (
      <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()}</div>
    )}
  </div>
);

const MetricBadge = ({ label, value }: { label: string; value: unknown }) => {
  const displayValue = () => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-muted/50 rounded-md">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-medium truncate">{displayValue()}</span>
      </div>
    </div>
  );
};
