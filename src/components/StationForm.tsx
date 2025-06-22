import { useFormik } from "formik";
import * as Yup from "yup";
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
import { v4 as uuidv4 } from "uuid";
import { useStationAdmin } from "../hooks/useStationAdmi";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import type { GasStation } from "../interface/GasStation";

const ZONES = ["Centro", "Max Paredes", "San Antonio", "Periférica", "Mallasa"];
const FUEL_TYPES = ["Especial", "Diesel", "GNV"];

const stationSchema = Yup.object({
  name: Yup.string().required("Nombre de la estación es requerida"),
  zone: Yup.string().required("Zona es requerida"),
  address: Yup.string().required("Dirección es requerida"),
  phone: Yup.string()
    .matches(/^\d{8}$/, "Teléfono debe contener al menos 8 dígitos")
    .required("Teléfono es requerido"),
  selectedDays: Yup.array().min(1, "Al menos selecciona un día"),
  services: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      capacity: Yup.number().min(1, "La capacidad debe ser superior a 0"),
      stock: Yup.number().min(0, "Stock no puede ser negativo"),
      selected: Yup.boolean(),
    })
  ).min(1, "Al menos selecciona un servicio"),
});

interface StationModalProps {
  open: boolean;
  onClose: () => void;
  station?: GasStation;
  isEditMode: boolean;
}

export default function StationModal({ open, onClose, station, isEditMode }: StationModalProps) {
  const { createStation, updateStation } = useStationAdmin();
  const { user } = useAuthStore();
  const [scheduleType, setScheduleType] = useState("Todos los dias");
  const [uniformHours, setUniformHours] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: station?.name || "",
      zone: station?.zone || "",
      address: station?.address || "",
      phone: station?.phone || "",
      selectedDays: station ? station.openingHours.map((h) => h.day) : [],
      openTime: station?.openingHours[0]?.open || "08:00",
      closeTime: station?.openingHours[0]?.close || "20:00",
      openingHours: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].map((day) => ({
        day,
        open: station?.openingHours.find((h) => h.day === day)?.open || "08:00",
        close: station?.openingHours.find((h) => h.day === day)?.close || "20:00",
      })),
      services: FUEL_TYPES.map((type) => ({
        name: type,
        capacity: station?.services.find((s) => s.name === type)?.capacity || 10000,
        stock: station?.services.find((s) => s.name === type)?.stock || 0,
        selected: !!station?.services.find((s) => s.name === type),
      })),
    },
    validationSchema: stationSchema,
    onSubmit: async (values) => {
      let daysToSubmit;
      if (scheduleType === "Todos los dias") {
        daysToSubmit = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
      } else if (scheduleType === "Lunes a Viernes") {
        daysToSubmit = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
      } else {
        daysToSubmit = values.selectedDays;
      }

      const stationData = {
        id: isEditMode ? station?.id : uuidv4(),
        userId: user?.id || "",
        name: values.name,
        zone: values.zone,
        address: values.address,
        phone: values.phone,
        openingHours: daysToSubmit.map((day) => ({
          day,
          open: uniformHours ? values.openTime : values.openingHours.find((h) => h.day === day)?.open || "08:00",
          close: uniformHours ? values.closeTime : values.openingHours.find((h) => h.day === day)?.close || "20:00",
        })),
        services: values.services
          .filter((s) => s.selected)
          .map((s) => ({ name: s.name, capacity: s.capacity, stock: s.stock })),
      };

      if (isEditMode) {
        await updateStation(stationData.id, stationData);
      } else {
        await createStation(stationData);
      }
      onClose();
      formik.resetForm();
    },
  });

  const handleDayChange = (day: string) => {
    const selectedDays = formik.values.selectedDays.includes(day)
      ? formik.values.selectedDays.filter((d) => d !== day)
      : [...formik.values.selectedDays, day];
    formik.setFieldValue("selectedDays", selectedDays);
  };

  const handleServiceChange = (event: React.MouseEvent<HTMLElement>, newServices: string[]) => {
    formik.setFieldValue(
      "services",
      formik.values.services.map((s) => ({
        ...s,
        selected: newServices.includes(s.name),
      }))
    );
  };

  const handleCapacityChange = (name: string, capacity: number) => {
    formik.setFieldValue(
      "services",
      formik.values.services.map((s) =>
        s.name === name ? { ...s, capacity } : s
      )
    );
  };

  const handleTimeChange = (day: string, field: string, value: string) => {
    formik.setFieldValue(
      "openingHours",
      formik.values.openingHours.map((h) =>
        h.day === day ? { ...h, [field]: value } : h
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? "Editar estación de combustible" : "Crear estación de combustible"}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de la estación"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Zona</InputLabel>
          <Select
            name="zone"
            value={formik.values.zone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zone && Boolean(formik.errors.zone)}
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
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1">Horario de atención</Typography>
        <ToggleButtonGroup
          value={scheduleType}
          exclusive
          onChange={(e, newValue) => newValue && setScheduleType(newValue)}
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
                    />
                    <TextField
                      label="Cerrado"
                      type="time"
                      value={formik.values.openingHours.find((h) => h.day === day)?.close || "20:00"}
                      onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                      fullWidth
                      sx={{ width: 150 }}
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Abierto"
              type="time"
              name="openTime"
              value={formik.values.openTime}
              onChange={formik.handleChange}
              fullWidth
            />
            <TextField
              label="Cerrado"
              type="time"
              name="closeTime"
              value={formik.values.closeTime}
              onChange={formik.handleChange}
              fullWidth
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
        {formik.values.services.map((service) => (
          service.selected && (
            <Box key={service.name} sx={{ mb: 2 }}>
              <TextField
                label={`Capacidad (${service.name})`}
                type="number"
                value={service.capacity}
                onChange={(e) =>
                  handleCapacityChange(service.name, parseInt(e.target.value))
                }
                sx={{ width: 150 }}
              />
            </Box>
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          {isEditMode ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}