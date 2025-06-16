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
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useStationAdmin } from "../../hooks/useStationAdmi";
import type { GasStation } from "../../interface/GasStation";
import { useState } from "react";

const DAYS = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];
const ZONES = ["Centro", "Max Paredes", "San Antonio", "Periférica", "Mallasa"];
const FUEL_TYPES = ["Especial", "Diesel", "GNV"];

const stationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  zone: Yup.string().required("Zone is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string()
    .matches(/^\d{8}$/, "Phone must be 8 digits")
    .required("Phone is required"),
  selectedDays: Yup.array().min(1, "At least one day must be selected"),
  services: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required(),
      capacity: Yup.number().min(1, "Capacity must be greater than 0"),
      stock: Yup.number().min(0, "Stock cannot be negative"),
      selected: Yup.boolean(),
    })
  ).min(1, "At least one service must be selected"),
});

interface EditStationModalProps {
  open: boolean;
  onClose: () => void;
  station: GasStation;
}

export default function EditStationModal({
  open,
  onClose,
  station,
}: EditStationModalProps) {
  const { updateStation } = useStationAdmin();
  const [uniformHours, setUniformHours] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: station.name,
      zone: station.zone,
      address: station.address,
      phone: station.phone,
      selectedDays: station.openingHours.map((h) => h.day),
      openTime: station.openingHours[0]?.open || "08:00",
      closeTime: station.openingHours[0]?.close || "20:00",
      openingHours: DAYS.map((day) => ({
        day,
        open:
          station.openingHours.find((h) => h.day === day)?.open || "08:00",
        close:
          station.openingHours.find((h) => h.day === day)?.close || "20:00",
      })),
      services: FUEL_TYPES.map((type) => ({
        name: type,
        capacity:
          station.services.find((s) => s.name === type)?.capacity || 10000,
        stock: station.services.find((s) => s.name === type)?.stock || 0,
        selected: !!station.services.find((s) => s.name === type),
      })),
    },
    validationSchema: stationSchema,
    onSubmit: async (values) => {
      const updatedStation = {
        name: values.name,
        zone: values.zone,
        address: values.address,
        phone: values.phone,
        openingHours: values.selectedDays.map((day) => ({
          day,
          open: uniformHours
            ? values.openTime
            : values.openingHours.find((h) => h.day === day)?.open || "08:00",
          close: uniformHours
            ? values.closeTime
            : values.openingHours.find((h) => h.day === day)?.close || "20:00",
        })),
        services: values.services
          .filter((s) => s.selected)
          .map((s) => ({ name: s.name, capacity: s.capacity, stock: s.stock })),
      };
      await updateStation(station.id, updatedStation);
      onClose();
    },
  });

  const handleDayChange = (day: string) => {
    const selectedDays = formik.values.selectedDays.includes(day)
      ? formik.values.selectedDays.filter((d) => d !== day)
      : [...formik.values.selectedDays, day];
    formik.setFieldValue("selectedDays", selectedDays);
  };

  const handleServiceChange = (name: string) => {
    formik.setFieldValue(
      "services",
      formik.values.services.map((s) =>
        s.name === name ? { ...s, selected: !s.selected } : s
      )
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Gas Station</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Station Name
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1">Zone</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Zone</InputLabel>
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

        <Typography variant="subtitle1">Address</Typography>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1">Phone</Typography>
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1">Opening Hours</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={uniformHours}
              onChange={() => setUniformHours(!uniformHours)}
            />
          }
          label="Uniform Hours for All Days"
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          {DAYS.map((day) => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={formik.values.selectedDays.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
              }
              label={day}
            />
          ))}
        </Box>
        {uniformHours ? (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Open"
              type="time"
              name="openTime"
              value={formik.values.openTime}
              onChange={formik.handleChange}
              fullWidth
            />
            <TextField
              label="Close"
              type="time"
              name="closeTime"
              value={formik.values.closeTime}
              onChange={formik.handleChange}
              fullWidth
            />
          </Box>
        ) : (
          formik.values.selectedDays.map((day) => (
            <Box key={day} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Typography sx={{ alignSelf: "center", width: 100 }}>
                {day}
              </Typography>
              <TextField
                label="Open"
                type="time"
                value={
                  formik.values.openingHours.find((h) => h.day === day)?.open ||
                  "08:00"
                }
                onChange={(e) =>
                  formik.setFieldValue(
                    "openingHours",
                    formik.values.openingHours.map((h) =>
                      h.day === day ? { ...h, open: e.target.value } : h
                    )
                  )
                }
                fullWidth
              />
              <TextField
                label="Close"
                type="time"
                value={
                  formik.values.openingHours.find((h) => h.day === day)?.close ||
                  "20:00"
                }
                onChange={(e) =>
                  formik.setFieldValue(
                    "openingHours",
                    formik.values.openingHours.map((h) =>
                      h.day === day ? { ...h, close: e.target.value } : h
                    )
                  )
                }
                fullWidth
              />
            </Box>
          ))
        )}
        <Typography variant="subtitle1">Services</Typography>
        {formik.values.services.map((service) => (
          <Box key={service.name} sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={service.selected}
                  onChange={() => handleServiceChange(service.name)}
                />
              }
              label={service.name}
            />
            {service.selected && (
              <TextField
                label="Capacity (L)"
                type="number"
                value={service.capacity}
                onChange={(e) =>
                  handleCapacityChange(service.name, parseInt(e.target.value))
                }
                sx={{ ml: 2, width: 150 }}
              />
            )}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}