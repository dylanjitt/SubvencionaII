import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useStationForm } from "../hooks/useStationForm";
import type { GasStation } from "../interface/GasStation";

interface StationModalProps {
  open: boolean;
  onClose: () => void;
  station?: GasStation;
  isEditMode: boolean;
}

export default function StationModal({ open, onClose, station, isEditMode }: StationModalProps) {
  const {
    formik,
    scheduleType,
    setScheduleType,
    handleDayChange,
    handleServiceChange,
    handleCapacityChange,
    handleTimeChange,
    handleOpenTimeChange,
    handleCloseTimeChange,
    handleNameChange,
    handleAddressChange,
    handlePhoneChange,
    ZONES,
    FUEL_TYPES,
  } = useStationForm({ station, isEditMode, onClose });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Editar estación de combustible" : "Crear estación de combustible"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de la estación"
          name="name"
          value={formik.values.name}
          onChange={handleNameChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 50 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Zona</InputLabel>
          <Select
            name="zone"
            value={formik.values.zone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zone && Boolean(formik.errors.zone)}
            required
          >
            {ZONES.map((zone) => (
              <MenuItem key={zone} value={zone}>
                {zone}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Dirección"
          name="address"
          value={formik.values.address}
          onChange={handleAddressChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 60 }}
        />
        <TextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={formik.values.phone}
          onChange={handlePhoneChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          sx={{ mb: 2 }}
          inputProps={{ maxLength: 8 }}
        />

        <Typography variant="subtitle1">Horario de atención</Typography>
        <ToggleButtonGroup
          value={scheduleType}
          exclusive
          onChange={(_, newValue) => newValue && setScheduleType(newValue)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="Todos los dias">Todos los dias</ToggleButton>
          <ToggleButton value="Lunes a Viernes">Lunes a Viernes</ToggleButton>
          <ToggleButton value="Atención personalizada">Atención personalizada</ToggleButton>
        </ToggleButtonGroup>
        {scheduleType === "Atención personalizada" ? (
          <Box sx={{ mb: 2 }}>
            {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].map((day) => (
              <Box key={day} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                    />
                  }
                  label={day}
                />
                {formik.values.selectedDays.includes(day) && (
                  <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
                    <TextField
                      label="Abierto"
                      type="time"
                      value={formik.values.openingHours.find((h) => h.day === day)?.open || "08:00"}
                      onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                      fullWidth
                      sx={{ width: 150 }}
                      inputProps={{ min: "05:00", max: "23:59" }}
                    />
                    <TextField
                      label="Cerrado"
                      type="time"
                      value={formik.values.openingHours.find((h) => h.day === day)?.close || "20:00"}
                      onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                      fullWidth
                      sx={{ width: 150 }}
                      inputProps={{ min: formik.values.openingHours.find((h) => h.day === day)?.open || "05:00", max: "23:59" }}
                    />
                  </Box>
                )}
              </Box>
            ))}
            {formik.touched.selectedDays && formik.errors.selectedDays && (
              <Typography color="error" variant="caption">
                {formik.errors.selectedDays}
              </Typography>
            )}
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Abierto"
              type="time"
              name="openTime"
              value={formik.values.openTime}
              onChange={handleOpenTimeChange}
              onBlur={formik.handleBlur}
              error={formik.touched.openTime && Boolean(formik.errors.openTime)}
              helperText={formik.touched.openTime && formik.errors.openTime}
              fullWidth
              inputProps={{ min: "05:00", max: "23:59" }}
            />
            <TextField
              label="Cerrado"
              type="time"
              name="closeTime"
              value={formik.values.closeTime}
              onChange={handleCloseTimeChange}
              onBlur={formik.handleBlur}
              error={formik.touched.closeTime && Boolean(formik.errors.closeTime)}
              helperText={formik.touched.closeTime && formik.errors.closeTime}
              fullWidth
              inputProps={{ min: formik.values.openTime, max: "23:59" }}
            />
          </Box>
        )}
        <Typography variant="subtitle1">Servicios</Typography>
        <ToggleButtonGroup
          value={formik.values.services.filter((s) => s.selected).map((s) => s.name)}
          onChange={handleServiceChange}
          sx={{ mb: 2 }}
        >
          {FUEL_TYPES.map((type) => (
            <ToggleButton key={type} value={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {formik.values.services.map((service, index) => (
          service.selected && (
            <Box key={service.name} sx={{ mb: 2 }}>
              <TextField
                label={`Capacidad (${service.name})`}
                type="number"
                value={service.capacity}
                onChange={(e) =>
                  handleCapacityChange(service.name, parseInt(e.target.value))
                }
                onBlur={() => formik.setFieldTouched(`services[${index}].capacity`)}
                error={
                  formik.touched.services &&
                  Array.isArray(formik.errors.services) &&
                  (formik.errors.services[index] as { capacity?: string })?.capacity != null
                }
                helperText={
                  formik.touched.services &&
                  Array.isArray(formik.errors.services) &&
                  (formik.errors.services[index] as { capacity?: string })?.capacity
                }
                sx={{ width: 150 }}
                inputProps={{ min: 10000, max: 600000 }}
              />
            </Box>
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          {isEditMode ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}