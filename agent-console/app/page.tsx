"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoomInfo } from "@/hooks/use-room-info";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { roomName, userId, setRoomName, setUserId } = useRoomInfo();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      router.push(
        `/room?roomId=${encodeURIComponent(roomName)}&userId=${encodeURIComponent(userId)}`
      );
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  return (
    <main className="h-full w-full bg-accent flex items-center justify-center">
      <form
        onSubmit={handleJoinRoom}
        className="bg-background p-8 rounded-lg space-y-4 min-w-[400px]"
      >
        <div className="space-y-2">
          <Label htmlFor="roomName">Room Name</Label>
          <Input
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">
          Join Room
        </Button>
      </form>
    </main>
  );
}
