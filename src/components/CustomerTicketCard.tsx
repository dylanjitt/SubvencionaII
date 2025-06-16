import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface CustomerTicketCardProps {
    gasStationName: string;
    cardPlate: string;
    ticketState: string;
    date: string;
    fuelType: string;
    quantity: string;
    onClick: () => void;
    cardType: string;
}

const CustomerTicketCard: React.FC<CustomerTicketCardProps> = ({
    gasStationName,
    cardPlate,
    ticketState,
    date,
    fuelType,
    quantity,
    onClick,
    cardType,
}) => {
    const formattedDate = new Date(date).toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'UTC',
    });

    const getTicketStateColor = (state: string) => {
        switch (state) {
            case 'Pendiente':
                return 'gray';
            case 'Reservado':
                return 'green';
            case 'Cancelado':
                return 'red';
            case 'Realizado':
                return 'black';
            default:
                return 'inherit';
        }
    };

    return (
        <Card style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)', borderRadius: '16px' }}>
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="#D3D3D3"
                    p={1}
                    borderRadius="8px"
                >
                    <Typography component="div" textAlign="center" style={{ fontWeight: 'bold' }}>
                        {gasStationName}
                    </Typography>
                </Box>
                {cardType === 'station' ? (
                    <>
                        <Typography>{cardPlate}</Typography>
                        <Typography>{ticketState}</Typography>
                        <Typography>{date}</Typography>
                        <Box textAlign="center" marginTop={1}>
                            <Button variant="contained" color="primary" onClick={onClick}>
                                Seleccionar
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                border={3}
                                borderColor="primary.main"
                                borderRadius="4px"
                                padding="2px"
                            >
                                <Typography p={1} style={{ fontWeight: 'bold' }} color="primary" textAlign="center">
                                    {cardPlate}
                                </Typography>
                            </Box>
                            <Typography marginLeft={2}
                                style={{
                                    color: getTicketStateColor(ticketState),
                                    fontWeight: 'bold',
                                }}
                            >
                                {ticketState}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography marginTop={1} >{formattedDate}</Typography>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography style={{ fontWeight: 'bold' }}>{fuelType}</Typography>
                                <Typography>{quantity}</Typography>
                            </Box>
                        </Box>
                        <Box textAlign="center" marginTop={1}>
                            {cardType === 'ticket' ? (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={onClick}
                                    disabled={ticketState !== 'Pendiente' && ticketState !== 'Reservado'}
                                >
                                    Cancelar
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onClick}
                                >
                                    Reservar
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default CustomerTicketCard;
