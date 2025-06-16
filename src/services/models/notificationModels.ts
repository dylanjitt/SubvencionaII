export interface SendNotificationsRequest {
  gasStationId: string;
  gasStationName: string;
  message: string;
  type: "New" | "Confirm" | "Confirmed" | "Cancel" | "Next" | "Finished" | "Stock"
}

export interface SendNotificationRequest {
  userId: string;
  gasStationId: string;
  gasStationName: string;
  message: string;
  type: "New" | "Confirm" | "Confirmed" | "Cancel" | "Next" | "Finished" | "Stock"
}