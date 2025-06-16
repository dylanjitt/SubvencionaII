import { create } from 'zustand';

interface Reservation {
    id?: number;
    gasStationName: string;
    gasStationId: string;
    carPlate: string;
    date: string;
    time: string;
    fuelType: string;
    ticketState: string;
    quantity?: number;
}

interface ReservationStore {
    reservations: Reservation[];
    addReservation: (reservation: any) => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
    reservations: [],
    addReservation: (reservation) =>
        set((state) => ({
            reservations: [
                ...state.reservations,
                ...(Array.isArray(reservation) ? reservation : [reservation])
            ],
        })),

}));
