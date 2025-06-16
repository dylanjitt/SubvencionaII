import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useStationAdmin } from "../../hooks/useStationAdmi";
import type { GasStation } from "../../interface/GasStation";

interface StockManagementModalProps {
  open: boolean;
  onClose: () => void;
  station: GasStation;
}

export default function StockManagementModal({
  open,
  onClose,
  station,
}: StockManagementModalProps) {
  const { updateStation } = useStationAdmin();

  const validationSchema = Yup.object(
    station.services.reduce(
      (acc, service) => ({
        ...acc,
        [service.name]: Yup.number()
          .min(0, "Stock cannot be negative")
          .max(
            service.capacity,
            `Stock cannot exceed capacity (${service.capacity} L)`,
          )
          .required("Stock is required"),
      }),
      {},
    ),
  );

  const formik = useFormik({
    initialValues: station.services.reduce(
      (acc, service) => ({ ...acc, [service.name]: service.stock }),
      {},
    ),
    validationSchema,
    onSubmit: async (values) => {
      const updatedServices = station.services.map((service) => ({
        ...service,
        stock: values[service.name],
      }));
      await updateStation(station.id, { services: updatedServices });
      onClose();
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Carga del tanque de combustible</DialogTitle>
      <DialogContent>
        {station.services.map((service) => (
          <Box key={service.name} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">{service.name}</Typography>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              name={service.name}
              value={formik.values[service.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched[service.name] &&
                Boolean(formik.errors[service.name])
              }
              helperText={
                formik.touched[service.name] && formik.errors[service.name]
              }
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={formik.handleSubmit}
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          Recargar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
