import BookingForm from '../components/BookingForm';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { useUser } from '../context/UserContext';
import { createTicket } from '../services/ticketsService';
import { useReservationStore } from '../store/reservationStore';

const BookingConfirmation = () => {
    const { user } = useUser();
    const location = useLocation();
    const gasStation = location.state?.gasStation;
    const fuelTypes = gasStation?.services.map((service: any) => service.name) || [];
    const licensePlates = user?.cars;
    const { addReservation } = useReservationStore();
    const navigate = useNavigate();
    const handleNavigateToBookingPage = () => {
        navigate('/user', { state: { ticketCreated: true } });
    };

    const handleSubmit = async (values: any) => {
        const { reservationDate, reservationTime, fuelType, licensePlate, quantity } = values;

        const fullDate = `${reservationDate}T${reservationTime}:00Z`;

        const newTicket = {
            id: uuidv4(),
            adminId: gasStation?.userId || "",
            gasStationId: gasStation?.id,
            gasStationName: gasStation?.name,
            customerId: user?.id,
            carPlate: licensePlate,
            date: fullDate,
            gasType: fuelType,
            quantity: quantity,
            amount: quantity * 0.6493389423,
            ticketState: "Pendiente",
        };

        try {
            createTicket(newTicket);
            addReservation(newTicket);
            console.log("Ticket creado:", newTicket);
            handleNavigateToBookingPage();
        } catch (error) {
            console.error("Error al crear ticket:", error);
        }
    };

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: 'auto' }}>
                    <Typography variant="h4" gutterBottom>
                        {gasStation?.name || 'Gas Station Name'}
                    </Typography>
                    <Typography variant="body1">{gasStation?.address || '123 Main St, City, Country'}</Typography>
                    <Typography variant="body1">{gasStation?.zone || 'Zone A'}</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}><strong>Teléfono:</strong> {gasStation?.phone || '123-456-7890'}</Typography>
                    <Typography sx={{ mt: 2 }}><strong>Horario:</strong></Typography>
                    <TableContainer component={Paper} >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Día</strong></TableCell>
                                    <TableCell align="center"><strong>Apertura</strong></TableCell>
                                    <TableCell align="center"><strong>Cierre</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gasStation?.openingHours.map((h: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell align="center">{h.day}</TableCell>
                                        <TableCell align="center">{h.open}</TableCell>
                                        <TableCell align="center">{h.close}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography marginTop={2}><strong>Servicios:</strong></Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Tipo</strong></TableCell>
                                    <TableCell align="center"><strong>Capacidad</strong></TableCell>
                                    <TableCell align="center"><strong>Stock Disponible</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gasStation?.services.map((s: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell align="center">{s.name}</TableCell>
                                        <TableCell align="center">{s.capacity}</TableCell>
                                        <TableCell align="center">{s.stock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Grid>
                <Box width={{ xs: '100%', sm: '100%', md: '50%' }} sx={{ mt: 2 }}
                >
                    <BookingForm fuelTypes={fuelTypes} licensePlates={licensePlates} onSubmit={handleSubmit} station={gasStation.id} />
                </Box>
            </Grid>
        </Container>
    );
};

export default BookingConfirmation;


