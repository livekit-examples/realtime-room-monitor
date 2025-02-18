"use client";

import LK from "@/components/lk";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoomInfo } from "@/hooks/use-room-info";
import { Github } from "lucide-react";
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
    <main className="h-full w-full bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <LK />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            LiveKit Realtime Observatory
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time monitoring and inspection tool for LiveKit rooms
          </p>
        </div>

        <Card className="p-8 space-y-6 shadow-lg">
          <form onSubmit={handleJoinRoom} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base">Room Configuration</Label>
              <p className="text-sm text-muted-foreground">
                Enter your LiveKit room details to start monitoring
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  The name of the LiveKit room you want to observe
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">Observer ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your observer ID"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Unique identifier for this monitoring session
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Observing
            </Button>
          </form>

          <div className="pt-4 border-t">
            <a
              href="https://github.com/LeetMock/voxant"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>View on GitHub</span>
            </a>
          </div>
        </Card>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Features include:</p>
          <div className="flex justify-center gap-4">
            <span>• Real-time event logs monitoring</span>
            <span>• Participant state inspection</span>
            <span>• All media track streaming</span>
          </div>
        </div>
      </div>
    </main>
  );
}
