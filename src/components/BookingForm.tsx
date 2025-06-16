import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TextField, MenuItem, Button, Grid, Typography } from '@mui/material';

interface BookingFormProps {
  fuelTypes: string[];
  licensePlates: string[];
}

const BookingForm: React.FC<BookingFormProps> = ({ fuelTypes, licensePlates }) => {
  const initialValues = {
    reservationDate: '',
    reservationTime: '',
    fuelType: '',
    licensePlate: '',
  };

  const validationSchema = Yup.object({
    reservationDate: Yup.string().required('La fecha es requerida'),
    reservationTime: Yup.string().required('La hora es requerida'),
    fuelType: Yup.string().required('El tipo de gasolina es requerido'),
    licensePlate: Yup.string().required('La placa del coche es requerida'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log('Formulario enviado:', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange }) => (
        <Form style={{ width: '100%' }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                Reservar Gasolina
              </Typography>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                id="reservationDate"
                name="reservationDate"
                label="Fecha de Reserva"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={values.reservationDate}
                onChange={handleChange}
                error={!!validationSchema.fields.reservationDate?.isValidSync(values.reservationDate)}
                helperText={<ErrorMessage name="reservationDate" />}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                id="reservationTime"
                name="reservationTime"
                label="Hora de Reserva"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={values.reservationTime}
                onChange={handleChange}
                error={!!validationSchema.fields.reservationTime?.isValidSync(values.reservationTime)}
                helperText={<ErrorMessage name="reservationTime" />}
              />
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                select
                id="fuelType"
                name="fuelType"
                label="Tipo de Gasolina"
                value={values.fuelType}
                onChange={handleChange}
                error={!!validationSchema.fields.fuelType?.isValidSync(values.fuelType)}
                helperText={<ErrorMessage name="fuelType" />}
              >
                <MenuItem value="">Seleccione un tipo</MenuItem>
                {fuelTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                select
                id="licensePlate"
                name="licensePlate"
                label="Placa del Coche"
                value={values.licensePlate}
                onChange={handleChange}
                error={!!validationSchema.fields.licensePlate?.isValidSync(values.licensePlate)}
                helperText={<ErrorMessage name="licensePlate" />}
              >
                <MenuItem value="">Seleccione una placa</MenuItem>
                {licensePlates.map((plate) => (
                  <MenuItem key={plate} value={plate}>
                    {plate}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Reservar
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;