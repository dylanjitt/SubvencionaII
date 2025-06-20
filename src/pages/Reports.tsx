import { FilterByStation } from "../components/reportComponents/filterByStation";
import { FilterByCancel } from "../components/reportComponents/filterByCancel";
import { Card } from "@mui/material";
import { FilterByType } from "../components/reportComponents/filterByType";
import { FilterByTypeLt } from "../components/reportComponents/filterByTypeLt";
import { FilterByRushHour } from "../components/reportComponents/filterByRushHour";
import { useReports } from "../hooks/useReport";

export function ReportsPage() {
  
  const {tickets}=useReports()

  return (
    <div style={{  margin: "0 auto" }}>
      <h1>Reporte de Uso</h1>
      <Card sx={{width:'100%',display:'flex',padding:'20px',backgroundColor:'#f4f4f4', justifyContent:'space-around'}}>
        <FilterByStation tickets={tickets} title="Turnos Por estación"/>
        <FilterByCancel tickets={tickets} title="Estados de Tickets"/>
      </Card>

      <Card sx={{width:'100%',display:'flex',padding:'20px',backgroundColor:'#f4f4f4', justifyContent:'space-around'}}>
        <FilterByType tickets={tickets} title="Reservas por Combustible"/>
        <FilterByTypeLt tickets={tickets} title="Flujo de Combustible (Lt)"/>
      </Card>
      <Card sx={{width:'100%',display:'flex',padding:'20px',backgroundColor:'#f4f4f4', justifyContent:'space-around'}}>
        <FilterByRushHour tickets={tickets} title="Horas de Mayor tráfico de Reservas"/>
      </Card>
      
    </div>
  );
}
