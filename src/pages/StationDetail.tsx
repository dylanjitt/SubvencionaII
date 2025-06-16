import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useStationStore } from "../store/stationStore";
import { gasStationService } from "../services/gasStationService";
import TicketCard from "../components/TicketCard";

interface Ticket {
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

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const stations = useStationStore((state) => state.stations);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [ticketStateFilter, setTicketStateFilter] = useState("");
  const station = stations.find((s) => s.id === id);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await gasStationService.getStations(); // Simula obtener tickets
        // TODO: Implementar endpoint real para tickets
        setTickets([]); // Placeholder
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };
    fetchTickets();
  }, [id]);

  const sortedTickets = useMemo(() => {
    const now = new Date("2025-06-15T18:10:00-04:00");
    let filtered = tickets;
    if (fuelTypeFilter) {
      filtered = filtered.filter((t) => t.gasType === fuelTypeFilter);
    }
    if (ticketStateFilter) {
      filtered = filtered.filter((t) => t.ticketState === ticketStateFilter);
    }

    const enTurno = filtered.filter((t) => t.ticketState === "EnTurno");
    const notificado = filtered.filter((t) => t.ticketState === "Notificado");
    const reservadoPendiente = filtered
      .filter((t) => ["Reservado", "Pendiente"].includes(t.ticketState))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const realizadoCancelado = filtered
      .filter((t) => ["Realizado", "Cancelado"].includes(t.ticketState))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return [
      ...enTurno,
      ...notificado,
      ...reservadoPendiente,
      ...realizadoCancelado,
    ];
  }, [tickets, fuelTypeFilter, ticketStateFilter]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {station?.name || "Station"}
        </Typography>
        <Grid container spacing={2} />
        {station?.services.map((service) => (
          <Grid size={{ xs: 12, sm: 4 }} key={service.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{service.name}</Typography>
                <Typography>
                  Stock: {service.stock}/{service.capacity}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth sx={{ mr: 2 }}>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              value={fuelTypeFilter}
              onChange={(e) => setFuelTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {station?.services.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Ticket State</InputLabel>
            <Select
              value={ticketStateFilter}
              onChange={(e) => setTicketStateFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="EnTurno">EnTurno</MenuItem>
              <MenuItem value="Notificado">Notificado</MenuItem>
              <MenuItem value="Reservado">Reservado</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="Realizado">Realizado</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container spacing={2}>
          {sortedTickets.map((ticket) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
