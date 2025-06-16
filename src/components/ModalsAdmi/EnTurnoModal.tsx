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
}

export default function EnTurnoModal({
  open,
  onClose,
  ticketId,
}: EnTurnoModalProps) {
  const handleFinalize = async () => {
    try {
      // Actualizar ticket actual a "Realizado"
      await jsonServerInstance.patch(`/tickets/${ticketId}`, {
        ticketState: "Realizado",
      });

      // Obtener todos los tickets
      const response = await jsonServerInstance.get("/tickets");
      const tickets = response.data;

      // Encontrar ticket en "Notificado" y actualizar a "EnTurno"
      const notificadoTicket = tickets.find(
        (t: any) => t.ticketState === "Notificado",
      );
      if (notificadoTicket) {
        await jsonServerInstance.patch(`/tickets/${notificadoTicket.id}`, {
          ticketState: "EnTurno",
        });
      }

      // Encontrar próximo ticket en "Reservado" o "Pendiente"
      const nextTicket = tickets
        .filter((t: any) => ["Reservado", "Pendiente"].includes(t.ticketState))
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        )[0];
      if (nextTicket) {
        await jsonServerInstance.patch(`/tickets/${nextTicket.id}`, {
          ticketState: "Notificado",
        });
      }

      onClose();
    } catch (error) {
      console.error("Failed to finalize ticket", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Did the service complete?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Confirm to mark this ticket as completed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFinalize} variant="contained">
          Finalized
        </Button>
      </DialogActions>
    </Dialog>
  );
}
