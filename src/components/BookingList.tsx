import React from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import { Grid, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerTicketCard from './CustomerTicketCard';

interface Booking {
  id: number;
  adminId: number;
  gasStationId: number;
  gasStationName: string;
  customerId: number;
  carPlate: string;
  date: string;
  gasType: string;
  quantity: number;
  amount: number;
  ticketState: string;
}

interface Props {
  bookings: Booking[];
  onCancel: (id: number) => void;
}

const BookingList: React.FC<Props> = ({ bookings, onCancel }) => {
  const location = useLocation();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [ticketCreatedSnackbar, setTicketCreatedSnackbar] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.ticketCreated) {
      setTicketCreatedSnackbar(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const navigate = useNavigate();

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (selectedId !== null) {
      onCancel(selectedId);
      setSnackbarOpen(true);
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleNavigateToBookingPage = () => {
    navigate('/bookings');
  };

  if (!Array.isArray(bookings)) {
    console.error('Invalid bookings data:', bookings);
    return <div>No hay reservas disponibles</div>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        TU TURNO RESERVADO
      </Typography>
      <Button variant="contained" color="primary" onClick={handleNavigateToBookingPage}>
        Reservar Turno
      </Button>
      {bookings.length === 0 ? (
        <Typography>No hay turnos reservados</Typography>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Grid
            container
            spacing={3}
            sx={{
              p: 2,
              mt: 2,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            {bookings.map((b) => (
              <Grid key={b.id}>
                <CustomerTicketCard
                  gasStationName={b.gasStationName}
                  cardPlate={b.carPlate}
                  ticketState={b.ticketState}
                  date={b.date}
                  fuelType={b.gasType}
                  quantity={`${b.quantity} Lts`}
                  onClick={() => handleDeleteClick(b.id)}
                  cardType="ticket"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>¿Cancelar turno?</DialogTitle>
        <DialogContent>
          Esta acción no se puede deshacer.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
          <Button color="error" onClick={handleConfirm}>Cancelar Turno</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        message="Turno cancelado exitosamente"
      />

      <Snackbar
        open={ticketCreatedSnackbar}
        onClose={() => setTicketCreatedSnackbar(false)}
        autoHideDuration={3000}
        message="Turno creado exitosamente"
      />

    </>
  );
};

export default BookingList;
