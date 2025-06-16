import { Button, Box } from "@mui/material";
import { useNotifier } from "../hooks/useNotifier";
import { useState } from "react";

export default function SimTestPage() {
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const { simulation, notificateStock } = useNotifier();
  const adminId = "714ad26c-65a8-44d4-8a91-31d3fa3c5825";
  const gasStationId = "13736dd1-8d4d-4693-b2af-f95fbe1677b9";
  const gasSationName = "GasStation_13736dd1";
  const gasType = "Diesel";
  const gasStationPhone = "76705049";

  const handleHappyPath = () => {
    simulation.simHappyPath(adminId, gasStationId, gasSationName, gasType);
  }

  const handleCancelByAdmin = () => {
    simulation.simTicketCancelByAdmin(adminId, gasStationId, gasSationName, gasType);
  }

  const handleCancelByUser = () => {
    simulation.simTicketCancelByUser(adminId, gasStationId, gasSationName, gasType);
  }

  const handleCancelByUserPostConfimartion = () => {
    simulation.simTicketCancelByUserPostConfirmation(adminId, gasStationId, gasSationName, gasType);
  }
  const handleStock = () => {
    const link = notificateStock(adminId, gasStationId, gasSationName, gasType, 500, gasStationPhone);
    setWhatsAppMessage(link);
  }

  return (
    <div>
      <h1>Sim Test Page</h1>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={handleStock}>Notificar Stock</Button>
        {whatsAppMessage.length != 0 && (
          <Box mt={2}>
            <a href={whatsAppMessage} target="_blank" rel="noopener noreferrer">
              Enviar mensaje por WhatsApp
            </a>
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleHappyPath}>Happy Path Sim</Button>
        <Button variant="contained" color="primary" onClick={handleCancelByUser}>Cancelado por el Cliente Sim </Button>
        <Button variant="contained" color="primary" onClick={handleCancelByUserPostConfimartion}>Cancelado por el Cliente despues de confirmar Sim </Button>
        <Button variant="contained" color="primary" onClick={handleCancelByAdmin}>Cancelado por el Administrador Sim </Button>
      </Box>
    </div>
  );
}