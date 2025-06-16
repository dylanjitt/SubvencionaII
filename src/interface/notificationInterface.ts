export interface Notification {
  id: string;
  userId: string;
  gasStationId: string;
  gasStationName: string;
  message: string;
  read: boolean;
  type: "New" | "Confirm" | "Confirmed" | "Cancel" | "Next" | "Finished" | "Stock"
}