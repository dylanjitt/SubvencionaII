// ReportsPage.tsx
import { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Title,
  SubTitle,
  Tooltip,
  Legend
} from "chart.js";

import { useAuthStore } from "../store/authStore";
import { useTicketDataStore } from "../store/ticketStore";
import { getTicketsData } from "../services/ticketDataService";
import CircleChart from "../components/circle";

// register the pieces we need
Chart.register(ArcElement, Title, SubTitle, Tooltip, Legend);

export function ReportsPage() {
  const { user } = useAuthStore();
  const { tickets, saveTickets } = useTicketDataStore();

  useEffect(() => {
    loadTicks();
  }, []);

  const loadTicks = async () => {
    try {
      const data = await getTicketsData(user.id);
      if (data) saveTickets(data);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Station Usage Report</h1>
      <CircleChart tickets={tickets}/>
    </div>
  );
}
