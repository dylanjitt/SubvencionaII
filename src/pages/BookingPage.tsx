import React, { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';

const BookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  const handleNewBooking = (bookingData: any) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      stationName: bookingData.stationId === '1' ? 'Estación Central' : 'Estación Norte', ///DATOS COCINADOS EN MASTER CHEF
    };
    setBookings([...bookings, newBooking]);
  };

  const handleCancelBooking = (id: number) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reservar Turno de Gasolina
      </Typography>
      {/* <BookingForm onSubmit={handleNewBooking} /> */}
      <Box mt={4}>
        <BookingList bookings={bookings} onCancel={handleCancelBooking} />
      </Box>
    </Container>
  );
};

export default BookingPage;
