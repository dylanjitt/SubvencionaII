import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import EnTurnoModal from "../components/ModalsAdmi/EnTurnoModal";

interface Ticket {
  id: string;
  customerId: string;
  carPlate: string;
  date: string;
  gasType: string;
  quantity: number;
  amount: number;
  ticketState: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const [openEnTurnoModal, setOpenEnTurnoModal] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: ticket.ticketState === "EnTurno" ? "lightblue" : "white",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">Ticket #{ticket.id}</Typography>
        <Typography variant="body2" color="text.secondary">
          Customer ID: {ticket.customerId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Car Plate: {ticket.carPlate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {new Date(ticket.date).toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fuel Type: {ticket.gasType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quantity: {ticket.quantity} L
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Amount: ${ticket.amount}
        </Typography>
        <Chip label={ticket.ticketState} color="primary" sx={{ mt: 1 }} />
      </CardContent>
      {ticket.ticketState === "EnTurno" && (
        <CardActions>
          <Button size="small" onClick={() => setOpenEnTurnoModal(true)}>
            Finalize
          </Button>
        </CardActions>
      )}
      <EnTurnoModal
        open={openEnTurnoModal}
        onClose={() => setOpenEnTurnoModal(false)}
        ticketId={ticket.id}
      />
    </Card>
  );
}
