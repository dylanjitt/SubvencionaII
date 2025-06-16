import { cancelTicket, getTickets } from "../services/ticketsService";
import { useUser } from "../context/UserContext";
import { useReservationStore } from "../store/reservationStore";
import { useEffect, useState } from "react";

export const useBooking = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const { user } = useUser();
    const { addReservation } = useReservationStore();

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            try {
                const response = await getTickets();
                const userBookings = response.filter(
                    (ticket: { customerId: string }) => ticket.customerId === user.id
                );
                setBookings(Array.isArray(userBookings) ? userBookings : []);
                addReservation(response);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setBookings([]);
            }
        };

        fetchBookings();
    }, [user, addReservation]);

    const handleCancel = async (id: number) => {
        try {
            await cancelTicket(id);
            setBookings((prev) =>
                prev.map((ticket) =>
                    ticket.id === id ? { ...ticket, ticketState: "Cancelado" } : ticket
                )
            );
        } catch (error) {
            console.error("Error al cancelar ticket:", error);
        }
    };

    return {
        bookings,
        handleCancel,
    };
};
