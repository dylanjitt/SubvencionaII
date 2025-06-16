import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import jsonServerInstance from "../../api/jsonServerInstance";

interface EnTurnoModalProps {
  open: boolean;
  onClose: () => void;
  ticketId: string;
  updateTicketState: (ticketId: string, newState: string) => void;
  gasStationId: string;
}

export default function EnTurnoModal({
  open,
  onClose,
  ticketId,
  updateTicketState,
  gasStationId,
}: EnTurnoModalProps) {
  const handleFinalize = async () => {
    try {
      const currentDateTime = new Date();
      console.log("Finalizing ticket:", ticketId, "at", currentDateTime.toLocaleString());

      await jsonServerInstance.patch(`/tickets/${ticketId}`, { ticketState: "Realizado" });
      updateTicketState(ticketId, "Realizado");
      console.log(`Ticket ${ticketId} updated to Realizado`);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await jsonServerInstance.get("/tickets");
      const tickets = response.data.filter((t: any) => t.gasStationId === gasStationId);
      console.log("Filtered tickets for gasStationId:", gasStationId, tickets);

      const enTurnoTickets = tickets.filter((t: any) => t.ticketState === "EnTurno");
      if (enTurnoTickets.length > 1) {
        enTurnoTickets.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        const closestEnTurno = enTurnoTickets[0];
        for (let i = 1; i < enTurnoTickets.length; i++) {
          const otherEnTurno = enTurnoTickets[i];
          await jsonServerInstance.patch(`/tickets/${otherEnTurno.id}`, { ticketState: "Notificado" });
          updateTicketState(otherEnTurno.id, "Notificado");
          console.log(`Ticket ${otherEnTurno.id} changed to Notificado due to multiple EnTurno`);
        }
        console.log(`Closest EnTurno retained: ${closestEnTurno.id}`);
      }

      const updatedTickets = tickets.map((t: any) =>
        enTurnoTickets.find((et: any) => et.id === t.id) ? enTurnoTickets.find((et: any) => et.id === t.id) : t
      );
      const currentEnTurno = updatedTickets.find((t: any) => t.ticketState === "EnTurno");
      if (!currentEnTurno) {
        const notificadoTicket = updatedTickets.find((t: any) => t.ticketState === "Notificado");
        if (notificadoTicket) {
          await jsonServerInstance.patch(`/tickets/${notificadoTicket.id}`, { ticketState: "EnTurno" });
          updateTicketState(notificadoTicket.id, "EnTurno");
          console.log(`Ticket ${notificadoTicket.id} updated to EnTurno (no previous EnTurno)`);
        } else {
          console.warn("No Notificado ticket found to promote to EnTurno");
        }
      }

      const nextTicket = updatedTickets
        .filter((t: any) => ["Reservado", "Pendiente"].includes(t.ticketState))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      if (nextTicket) {
        await jsonServerInstance.patch(`/tickets/${nextTicket.id}`, { ticketState: "Notificado" });
        updateTicketState(nextTicket.id, "Notificado");
        console.log(`Ticket ${nextTicket.id} updated to Notificado`);
      } else {
        console.warn("No Reservado/Pendiente ticket found for gasStationId:", gasStationId);
      }

      onClose();
    } catch (error) {
      console.error("Failed to finalize ticket", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>¿Se concretó el servicio?</DialogTitle>
      <DialogContent>
        <DialogContentText>Confirma la ficha como completada.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleFinalize} variant="contained">
          Finalizado
        </Button>
      </DialogActions>
    </Dialog>
  );
}