import React, { useState } from 'react';
import { Container, Typography, Modal, Box, Button } from '@mui/material';
import { Grid } from '@mui/material';
import CustomerTicketCard from '../components/CustomerTicketCard';
import { useNavigate } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const navigate = useNavigate();
  const handleNavigateToBookingPage = () => {
    navigate('/bookings/confirmation');
  };

  const stations = [
    {
      gasStationName: 'Estación 1',
      address: 'Calle 123',
      zone: 'Zona A',
      phone: '123-456-789',
      openingHours: '8:00 AM - 8:00 PM',
      services: ['Gasolina Regular', 'Gasolina Premium'],
    },
    {
      gasStationName: 'Estación 2',
      address: 'Avenida 456',
      zone: 'Zona B',
      phone: '987-654-321',
      openingHours: '7:00 AM - 9:00 PM',
      services: ['Gasolina Regular', 'Diesel'],
    },
    {
      gasStationName: 'Estación 3',
      address: 'Boulevard 789',
      zone: 'Zona C',
      phone: '555-555-555',
      openingHours: '6:00 AM - 10:00 PM',
      services: ['Gasolina Premium', 'Diesel'],
    },
  ];

  const handleOpenModal = (station: any) => {
    setSelectedStation(station);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedStation(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reservar Turno de Gasolina
      </Typography>
      <Grid container spacing={2}>
        {stations.map((station, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <CustomerTicketCard
              gasStationName={station.gasStationName}
              cardPlate={station.address}
              ticketState={station.zone}
              date=""
              fuelType=""
              quantity=""
              onClick={() => handleOpenModal(station)}
              cardType="station"
            />
          </Grid>
        ))}
      </Grid>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedStation && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {selectedStation.gasStationName}
              </Typography>
              <Typography><strong>Teléfono:</strong> {selectedStation.phone}</Typography>
              <Typography><strong>Dirección:</strong> {selectedStation.address}</Typography>
              <Typography><strong>Zona:</strong> {selectedStation.zone}</Typography>
              <Typography><strong>Horario:</strong> {selectedStation.openingHours}</Typography>
              <Typography><strong>Servicios:</strong> {selectedStation.services.join(', ')}</Typography>
              <Button sx={{ mt: 4 }} size="large" fullWidth variant="contained" color="primary" onClick={handleNavigateToBookingPage}>
                Reservar
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default BookingPage;
