import { Button } from "@mui/material";
import { useNotifier } from "../hooks/useNotifier";

export default function SimTestPage() {
  const { simulation } = useNotifier();
  const adminId = "714ad26c-65a8-44d4-8a91-31d3fa3c5825";
  const gasStationId = "13736dd1-8d4d-4693-b2af-f95fbe1677b9";
  const gasSationName = "GasStation_13736dd1";
  const gasType = "Diesel";

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

  return (
    <div>
      <h1>Sim Test Page</h1>
      <Button variant="contained" color="primary" onClick={handleHappyPath}>Happy Path Sim</Button>
      <Button variant="contained" color="primary" onClick={handleCancelByUser}>Cancelado por el Cliente Sim </Button>
      <Button variant="contained" color="primary" onClick={handleCancelByUserPostConfimartion}>Cancelado por el Cliente despues de confirmar Sim </Button>
      <Button variant="contained" color="primary" onClick={handleCancelByAdmin}>Cancelado por el Administrador Sim </Button>
    </div>
  );
}