import { useEffect, useState } from "react"
import BookingList from "../components/BookingList"
import jsonServerInstance from "../api/jsonServerInstance"

function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const userId = "ae1e9c7c-7cb3-4249-8fa4-095353e4c137" // TODO: Hardcoded userId Nacho needs to change it later

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await jsonServerInstance.get("/tickets", {
          params: { customerId: userId }
        })
        console.log("Bookings fetched:", response.data);
        setBookings(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
        setBookings([])
      }
    }

    fetchBookings()
  }, [])

  const handleCancel = (id: number) => {
    console.log("Cancel booking with id:", id)
  }

  return (
    <>
      <BookingList bookings={bookings} onCancel={handleCancel} />
    </>
  )
}

export default DashboardPage