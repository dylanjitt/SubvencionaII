import React, { useState, useEffect } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Dayjs } from 'dayjs';

const mockStations = [ ///////////////// DATOS SIMULADOS //////////////////
  {
    id: 1,
    name: 'Estación Central',
    fuels: ['gasolina', 'diesel', 'gnv'],
  },
  {
    id: 2,
    name: 'Estación Norte',
    fuels: ['gasolina', 'diesel'],
  },
];

interface Props {
  onSubmit: (values: any) => void;
}

const BookingForm: React.FC<Props> = ({ onSubmit }) => {
  const [availableFuels, setAvailableFuels] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);

  const formik = useFormik({
    initialValues: {
      stationId: '',
      fuelType: '',
    },
    validationSchema: Yup.object({
      stationId: Yup.string().required('Selecciona una estación'),
      fuelType: Yup.string().required('Selecciona un tipo de combustible'),
    }),
    onSubmit: (values) => {
      if (!selectedDate || !selectedTime) return;
      const date = selectedDate.format('YYYY-MM-DD');
      const time = selectedTime.format('HH:mm');
      onSubmit({ ...values, date, time });
    },
  });

  useEffect(() => {
    const station = mockStations.find((s) => s.id.toString() === formik.values.stationId.toString());
    setAvailableFuels(station ? station.fuels : []);
    formik.setFieldValue('fuelType', '');
    console.log('Available fuels updated:', station);

  }, [formik.values.stationId]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} display="flex" gap={2} flexDirection="column" maxWidth={400}>
      <TextField
        select
        fullWidth
        label="Estación"
        name="stationId"
        value={formik.values.stationId}
        onChange={formik.handleChange}
        error={Boolean(formik.touched.stationId && formik.errors.stationId)}
        helperText={formik.touched.stationId && formik.errors.stationId}
      >
        {mockStations.map((station) => (
          <MenuItem key={station.id} value={station.id}>
            {station.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        fullWidth
        label="Combustible"
        name="fuelType"
        value={formik.values.fuelType}
        onChange={formik.handleChange}
        error={Boolean(formik.touched.fuelType && formik.errors.fuelType)}
        helperText={formik.touched.fuelType && formik.errors.fuelType}
        disabled={!formik.values.stationId}
      >
        {availableFuels.map((fuel) => (
          <MenuItem key={fuel} value={fuel}>
            {fuel}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Selecciona una fecha"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Selecciona una hora"
        type="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button type="submit" variant="contained" color="primary">
        Reservar
      </Button>
    </Box>
  );
};

export default BookingForm;