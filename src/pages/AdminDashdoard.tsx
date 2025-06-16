import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Grid,
} from "@mui/material";
import { useStationAdmin } from "../hooks/useStationAdmi";
import { useStationStore } from "../store/stationStore";
import StationCard from "../components/StationCard";
import CreateStationModal from "../components/ModalsAdmi/CreateStationModal";

const ZONES = ["Centro", "Max Paredes", "San Antonio", "Periférica", "Mallasa"];
const FUEL_TYPES = ["Especial", "Diesel", "GNV"];

export default function AdminDashboard() {
  const { fetchStations, filterStations } = useStationAdmin();
  const stations = useStationStore((state) => state.stations);
  const [searchName, setSearchName] = useState("");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [fuelType, setFuelType] = useState("");
  const [hasStock, setHasStock] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const filteredStations = useMemo(() => {
    let result = stations.filter((station) =>
      station.name.toLowerCase().includes(searchName.toLowerCase()),
    );
    if (selectedZones.length > 0) {
      result = result.filter((station) => selectedZones.includes(station.zone));
    }
    if (fuelType) {
      result = result.filter((station) =>
        station.services.some((service) => service.name === fuelType),
      );
    }
    if (hasStock) {
      result = result.filter((station) =>
        station.services.some((service) => service.stock > 0),
      );
    }
    return result.sort((a, b) => a.id.localeCompare(b.id));
  }, [stations, searchName, selectedZones, fuelType, hasStock]);

  const handleZoneChange = (event: any) => {
    const value = event.target.value;
    setSelectedZones(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Buscar..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl sx={{ width: 200 }}>
            <InputLabel>Zonas</InputLabel>
            <Select
              multiple
              value={selectedZones}
              onChange={handleZoneChange}
              input={<OutlinedInput label="Zones" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {ZONES.map((zone) => (
                <MenuItem key={zone} value={zone}>
                  <Checkbox checked={selectedZones.includes(zone)} />
                  <ListItemText primary={zone} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }}>
            <InputLabel>Tipo de combustible</InputLabel>
            <Select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {FUEL_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 150 }}>
            <InputLabel>Disponibilidad de combustible</InputLabel>
            <Select
              value={hasStock ? "yes" : "no"}
              onChange={(e) => setHasStock(e.target.value === "yes")}
            >
              <MenuItem value="yes">Si</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          onClick={() => setOpenCreateModal(true)}
          sx={{ mb: 3 }}
        >
          Crear estación de gasolina
        </Button>
        <Grid container spacing={2}>
          {filteredStations.map((station) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={station.id}>
              <StationCard station={station} />
            </Grid>
          ))}
        </Grid>
        <CreateStationModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        />
      </Box>
    </>
  );
}
