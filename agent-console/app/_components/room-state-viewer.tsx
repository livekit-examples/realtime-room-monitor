import { useLivekitState } from "@/hooks/use-livekit";
import { cn } from "@/lib/utils";

export const RoomStateViewer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const {
    room: { connectionState, name, metadata },
  } = useLivekitState();

  return (
    <div className={cn("rounded-lg border p-4 shadow-sm bg-muted/30", className)} {...props}>
      <h2 className="text-lg font-bold">Room State</h2>
      <p className="text-sm text-muted-foreground">The current state of the room.</p>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Connection State: {connectionState}</p>
        <p className="text-sm text-muted-foreground">Name: {name}</p>
        <p className="text-sm text-muted-foreground">Metadata: {metadata}</p>
      </div>
    </div>
  );
};
