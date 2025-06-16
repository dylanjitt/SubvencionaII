import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ticketData } from "../interface/ticketDataInterface";

interface ticketStoreInterface{
  tickets: ticketData[];
  saveTickets: (tickets:ticketData[])=>void
}

export const useTicketDataStore = create<ticketStoreInterface>()(
  persist(
    (set)=>({
      tickets:[]as ticketData[],
      saveTickets:(tickets:ticketData[])=>set({tickets})
    }),
    {name:'ticketsData'}
  )
)