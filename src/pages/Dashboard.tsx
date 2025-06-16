import BookingList from "../components/BookingList";
import { useBooking } from "../hooks/useBooking";

function DashboardPage() {
  const { bookings, handleCancel } = useBooking();

  return <BookingList bookings={bookings} onCancel={handleCancel} />;
}

export default DashboardPage;
