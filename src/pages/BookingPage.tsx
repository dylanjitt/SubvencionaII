import React from 'react';
import { Container, Typography, Modal, Box, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Grid } from '@mui/material';
import CustomerTicketCard from '../components/CustomerTicketCard';
import { useNavigate } from 'react-router-dom';
import { useGasStations } from '../hooks/useGasStations';

const BookingPage: React.FC = () => {
  const {
    filteredStations,
    selectedZone,
    selectedStation,
    open,
    zones,
    handleZoneChange,
    handleOpenModal,
    handleCloseModal,
  } = useGasStations();

  const navigate = useNavigate();

  const handleNavigateToBookingPage = () => {
    console.log("Navigating to booking confirmation with station:", selectedStation);
    navigate('/bookings/confirmation', { state: { gasStation: selectedStation } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reservar Turno de Gasolina
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="zone-filter-label">Filtrar por Zona</InputLabel>
        <Select
          labelId="zone-filter-label"
          value={selectedZone}
          onChange={(e) => handleZoneChange(e.target.value)}
          label="Filtrar por Zona"
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {zones.map((zone, index) => (
            <MenuItem key={index} value={zone}>
              {zone}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box>
        <Grid container
          spacing={3}
          sx={{
            p: 2,
            mt: 2,
            justifyContent: 'center'
          }}>
          {filteredStations.map((station, index) => (
            <Grid key={index}>
              <CustomerTicketCard
                gasStationName={station.name}
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
      </Box>
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
              <Typography><strong>Horario:</strong></Typography>
              {selectedStation.openingHours.map((h: any, idx: number) => (
                <Typography key={idx}>
                  {h.day}: {h.open} - {h.close}
                </Typography>
              ))}
              <Typography><strong>Servicios:</strong></Typography>
              {selectedStation.services.map((s: any, idx: number) => (
                <Typography key={idx}>
                  {s.name}
                </Typography>
              ))}

              <Button
                sx={{ mt: 4 }}
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleNavigateToBookingPage}
              >
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
