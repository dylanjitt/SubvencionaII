import jsonServerInstance from "../api/jsonServerInstance";

export const getTickets = async () => {
  try {
    const response = await jsonServerInstance.get("/tickets");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

export const createTicket = async (ticket: any) => {
  try {
    const response = await jsonServerInstance.post("/tickets", ticket);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const cancelTicket = async (id: number) => {
  try {
    const response = await jsonServerInstance.patch(`/tickets/${id}`, { ticketState: "Cancelado" });
    return response.data;
  } catch (error) {
    console.error("Error canceling ticket:", error);
    throw error;
  }
};