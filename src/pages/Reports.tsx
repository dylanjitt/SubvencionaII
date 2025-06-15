// ReportsPage.tsx
import { useEffect } from "react";

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
import { FilterByStation } from "../components/reportComponents/filterByStation";
import { FilterByCancel } from "../components/reportComponents/filterByCancel";
import { Card } from "@mui/material";


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
      console.log('data:',data)
      if (data) saveTickets(data);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div style={{  margin: "0 auto" }}>
      <h1>Station Usage Report</h1>
      <Card sx={{width:'100%',display:'flex'}}>
        <FilterByStation tickets={tickets} title="Turnos Por estación"/>
      <FilterByCancel tickets={tickets} title="Cancelaciones"/>
      </Card>
      
    </div>
  );
}
