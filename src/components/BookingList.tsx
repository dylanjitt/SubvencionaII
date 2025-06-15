import React, { useState } from 'react';
import BookingForm from './BookingForm';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Booking {
  id: number;
  stationName: string;
  fuelType: string;
  date: string;
  time: string;
}

interface Props {
  bookings: Booking[];
  onCancel: (id: number) => void;
}

const BookingList: React.FC<Props> = ({ bookings, onCancel }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [formModalOpen, setFormModalOpen] = useState(false); // Estado para el modal del formulario

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

  const handleFormSubmit = (values: any) => {
    console.log('Form submitted:', values);
    setFormModalOpen(false); // Cerrar el modal después de enviar el formulario
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Tu turno reservado
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setFormModalOpen(true)}>
        Reservar Turno
      </Button>
      <List>
        {bookings.map((b) => (
          <ListItem
            key={b.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDeleteClick(b.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={`${b.stationName} - ${b.fuelType}`}
              secondary={`${b.date} a las ${b.time}`}
            />
          </ListItem>
        ))}
      </List>

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

      <Dialog open={formModalOpen} onClose={() => setFormModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reservar Turno</DialogTitle>
        <DialogContent>
          <BookingForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        message="Turno cancelado exitosamente"
      />
    </>
  );
};

export default BookingList;
