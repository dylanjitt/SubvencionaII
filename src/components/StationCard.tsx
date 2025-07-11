import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { GasStation } from "../interface/GasStation";
import { useStationAdmin } from "../hooks/useStationAdmi";
import DeleteStationModal from "../components/ModalsAdmi/DeleteStationModal";
import EditStationModal from "../components/ModalsAdmi/EditStationModal";
import StockManagementModal from "../components/ModalsAdmi/StockManagementModal";
import { useNavigate } from "react-router-dom";

interface StationCardProps {
  station: GasStation;
}

export default function StationCard({ station }: StationCardProps) {
  const { deleteStation } = useStationAdmin();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openStockModal, setOpenStockModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteStation(station.id);
    setOpenDeleteModal(false);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{station.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Zona: {station.zone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Direacción: {station.address}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Teléfono: {station.phone}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Servicios:
          </Typography>
          {station.services.map((service) => (
            <Chip
              key={service.name}
              label={`${service.name} (${service.stock}/${service.capacity})`}
              sx={{ mr: 1, mt: 1 }}
            />
          ))}
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Horario de atención:
          </Typography>
          {station.openingHours.map((hour) => (
            <Typography key={hour.day} variant="body2" color="text.secondary">
              {hour.day}: {hour.open} - {hour.close}
            </Typography>
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/admin/gasStation/${station.id}`)}
        >
          <SettingsIcon />
        </Button>
        <Button size="small" onClick={() => setOpenEditModal(true)}>
          <EditIcon />
        </Button>
        <Button size="small" onClick={() => setOpenStockModal(true)}>
          <InventoryIcon />
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => setOpenDeleteModal(true)}
        >
          <DeleteIcon />
        </Button>
      </CardActions>
      <DeleteStationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <EditStationModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        station={station}
      />
      <StockManagementModal
        open={openStockModal}
        onClose={() => setOpenStockModal(false)}
        station={station}
      />
    </Card>
  );
}
