import BookingForm from '../components/BookingForm';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

const BookingConfirmation = () => {
    const gasStation = {
        name: 'Gas Station Name',
        address: '123 Main St, City, Country',
        price: '$3.50 per gallon',
    };

    const fuelTypes = ['Regular', 'Premium', 'Diesel'];
    const licensePlates = ['ABC123', 'XYZ789', 'LMN456'];

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: 'auto' }}>
                    <Typography variant="h4" gutterBottom>
                        {gasStation.name}
                    </Typography>
                    <Typography variant="body1">{gasStation.address}</Typography>
                    <Typography variant="body1">{gasStation.price}</Typography>
                </Grid>
                <Box width={{ xs: '100%', sm: '100%', md: '50%' }} sx={{ mt: 2 }}
                >
                    <BookingForm fuelTypes={fuelTypes} licensePlates={licensePlates} />
                </Box>
            </Grid>
        </Container>
    );
};

export default BookingConfirmation;
