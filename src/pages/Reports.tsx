import { FilterByStation } from "../components/reportComponents/filterByStation";
import { FilterByCancel } from "../components/reportComponents/filterByCancel";
import { FilterByType } from "../components/reportComponents/filterByType";
import { FilterByTypeLt } from "../components/reportComponents/filterByTypeLt";
import { FilterByRushHour } from "../components/reportComponents/filterByRushHour";
import { useReports } from "../hooks/useReport";
import { Card, Grid } from "@mui/material";

export function ReportsPage() {
  const { tickets } = useReports();

  return (
    <div style={{ margin: "0 auto" ,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
      <h1>Reporte de Uso</h1>
      <Card
        sx={{
          width: '100%',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          maxWidth:"1600px"
        }}
      >
        <Grid container spacing={2}  width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          {/* First Row - 3 items */}
          <Grid xs={4} sm={4}>
            <FilterByStation tickets={tickets} title="Turnos Por estación" />
          </Grid>
          <Grid  xs={8} sm={8}>
            <FilterByRushHour tickets={tickets} title="Horas de Mayor tráfico de Reservas" />
          </Grid>
          <Grid  xs={4} sm={4}>
            <FilterByCancel tickets={tickets} title="Estados de Tickets" />
          </Grid>
          <Grid  xs={4} sm={4}>
            <FilterByType tickets={tickets} title="Reservas por Combustible" />
          </Grid>

          {/* Second Row - 2 items */}
          <Grid  xs={4} sm={4}>
            <FilterByTypeLt tickets={tickets} title="Flujo de Combustible (Lt)" />
          </Grid>
          
        </Grid>
      </Card>
    </div>
  );
}
