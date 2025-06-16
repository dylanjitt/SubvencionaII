import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useTicketDataStore } from "../store/ticketStore";
import { getTicketsData } from "../services/ticketDataService";

export const useReports=()=>{
  const { user } = useAuthStore();
  const { tickets, saveTickets } = useTicketDataStore();

  useEffect(() => {
    loadTicks();
  }, []);

  const loadTicks = async () => {
    try {
      const data = await getTicketsData(user.id);
      console.log('data:',data)
      if (data) saveTickets(data);
    } catch (err) {
      console.error(err);
    }
  };
  return {tickets}
}