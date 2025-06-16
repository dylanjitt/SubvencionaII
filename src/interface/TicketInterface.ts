export interface Ticket {
  id: string;
  adminId: string;
  gasStationId: string;
  gasStationName: string;
  customerId: string;
  carPlate: string;
  date: string;
  gasType: string;
  quantity: number;
  amount: number;
  ticketState: string;
}
