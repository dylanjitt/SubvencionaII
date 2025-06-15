export interface ticketData{
  id:string,
  admin_id:string,
  gas_station_id: string,
  customer_data_id: string,
  auto: {
  placa: string,
  "b-sisa": string
      },
      date: string,
      gas_type: string,
      quantity_lt: number,
      amount: number,
      ticket_state: string
}