import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, MenuItem, Button, Typography } from '@mui/material';
import { useReservationStore } from '../store/reservationStore';
import { parseISO, differenceInMinutes } from 'date-fns';

interface BookingFormProps {
  fuelTypes: string[];
  licensePlates?: string[];
  onSubmit: (values: any) => void;
  station: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ fuelTypes, licensePlates, onSubmit, station }) => {
  const { reservations } = useReservationStore();
  const initialValues = {
    reservationDate: '',
    reservationTime: '',
    fuelType: '',
    licensePlate: '',
    quantity: 5,
  };

  const validationSchema = Yup.object({
    reservationDate: Yup.string().required('La fecha es requerida'),

    reservationTime: Yup.string()
      .required('La hora es requerida')
      .test('no-overlap', 'Ya existe una reserva cercana a ese horario', function (value) {
        const { reservationDate } = this.parent;
        if (!reservationDate || !value) return true;
        const selectedDateTime = `${reservationDate}T${value}Z`;
        const selectedDateTimeISO = parseISO(selectedDateTime).toISOString();
        for (const res of reservations) {
          const reservedDate = parseISO(res.date);
          const diff = Math.abs(differenceInMinutes(reservedDate, selectedDateTimeISO));
          if (
            reservedDate.toISOString().slice(0, 10) === reservationDate &&
            diff < 15 && res.gasStationId === station
          ) {
            return false;
          }
        }
        return true;
      })
      .test('past-time', 'La hora no puede ser en el pasado', function (value) {
        const { reservationDate } = this.parent;
        if (!reservationDate || !value) return true;
        const selectedDateTime = new Date(`${reservationDate}T${value}`);
        const now = new Date().toISOString();
        return (selectedDateTime) >= parseISO(now);
      }),

    fuelType: Yup.string().required('El tipo de gasolina es requerido'),
    licensePlate: Yup.string().required('La placa del coche es requerida'),
    quantity: Yup.number().required('La cantidad es requerida').test('min-value', 'La cantidad mínima es 5', (value) => value >= 5),
  });

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isValid, dirty }) => {

        return (

          <Form style={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Reservar Gasolina
            </Typography>

            <div style={{ marginBottom: '16px' }}>
              <Field
                as={TextField}
                fullWidth
                id="reservationDate"
                name="reservationDate"
                label="Fecha de Reserva"
                type="date"
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                InputLabelProps={{ shrink: true }}
                error={touched.reservationDate && Boolean(errors.reservationDate)}
                helperText={touched.reservationDate && errors.reservationDate}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Field
                as={TextField}
                fullWidth
                id="reservationTime"
                name="reservationTime"
                label="Hora de Reserva"
                type="time"
                InputLabelProps={{ shrink: true }}
                error={touched.reservationTime && Boolean(errors.reservationTime)}
                helperText={touched.reservationTime && errors.reservationTime}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Field
                as={TextField}
                select
                fullWidth
                id="fuelType"
                name="fuelType"
                label="Tipo de Gasolina"
                error={touched.fuelType && Boolean(errors.fuelType)}
                helperText={touched.fuelType && errors.fuelType}
              >
                <MenuItem value="">Seleccione un tipo</MenuItem>
                {fuelTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Field>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Field
                as={TextField}
                select
                fullWidth
                id="licensePlate"
                name="licensePlate"
                label="Placa del Coche"
                error={touched.licensePlate && Boolean(errors.licensePlate)}
                helperText={touched.licensePlate && errors.licensePlate}
              >
                <MenuItem value="">Seleccione una placa</MenuItem>
                {licensePlates?.map((plate) => (
                  <MenuItem key={plate} value={plate}>
                    {plate}
                  </MenuItem>
                ))}
              </Field>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Field
                as={TextField}
                fullWidth
                id="quantity"
                name="quantity"
                label="Cantidad de Gasolina"
                type="number"
                inputProps={{ min: 5 }}
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
              />
            </div>

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!(isValid && dirty)}>
              Reservar
            </Button>
          </Form>
        )
      }}
    </Formik>
  );
};

export default BookingForm;