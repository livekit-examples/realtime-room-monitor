import { ConnectionDetails } from "@/app/api/connection-details/route";
import { create } from "zustand";

export const useConnectionDetails = create<{
  connectionDetails: ConnectionDetails | undefined;
  updateConnectionDetails: (connectionDetails: ConnectionDetails | undefined) => void;
}>((set) => ({
  connectionDetails: undefined,
  updateConnectionDetails: (connectionDetails) => set({ connectionDetails }),
}));
