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
import type { Ticket } from "../interface/TicketInterface";

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
        const response = await gasStationService.getTicketsByGasStationId(id!);
        console.log("Tickets response (StationDetail):", response);
        setTickets(response || []);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };
    fetchTickets();
  }, [id]);

  const updateTicketState = (ticketId: string, newState: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ticketState: newState } : ticket
      )
    );
  };

  const sortedTickets = useMemo(() => {
    if (!tickets || tickets.length === 0) {
      console.log("No tickets available, tickets:", tickets);
      return [];
    }
    const now = new Date();
    let filtered = tickets;
    if (fuelTypeFilter && station?.services) {
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

    console.log("Sorted tickets:", [
      ...enTurno,
      ...notificado,
      ...reservadoPendiente,
      ...realizadoCancelado,
    ]);
    return [...enTurno, ...notificado, ...reservadoPendiente, ...realizadoCancelado];
  }, [tickets, fuelTypeFilter, ticketStateFilter, station?.services]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {station?.name || "Station"}
      </Typography>
      <Grid container spacing={2}>
        {station?.services?.map((service) => (
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
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth sx={{ mr: 2 }}>
            <InputLabel>Fuel Type</InputLabel>
            <Select
              value={fuelTypeFilter}
              onChange={(e) => setFuelTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {station?.services?.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
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
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {sortedTickets.length > 0 ? (
          sortedTickets.map((ticket) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={ticket.id}>
              <TicketCard
                ticket={ticket}
                updateTicketState={updateTicketState}
                gasStationId={id!}
              />
            </Grid>
          ))
        ) : (
          <Typography>No tickets available</Typography>
        )}
      </Grid>
    </Box>
  );
}