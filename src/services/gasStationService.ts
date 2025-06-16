import jsonServerInstance from "../api/jsonServerInstance";
import type { GasStation } from "../interface/GasStation";
import type { Ticket } from "../interface/TicketInterface";

export const gasStationService = {
  async getStations(): Promise<GasStation[]> {
    try {
      const response = await jsonServerInstance.get("/gasStations");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch stations", error);
      throw error;
    }
  },

  async getStationById(id: string): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.get(`/gasStations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch station", error);
      throw error;
    }
  },

  async createStation(station: Omit<GasStation, "id">): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.post("/gasStations", station);
      return response.data;
    } catch (error) {
      console.error("Failed to create station", error);
      throw error;
    }
  },

  async updateStation(
    id: string,
    station: Partial<GasStation>
  ): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.patch(`/gasStations/${id}`, station);
      return response.data;
    } catch (error) {
      console.error("Failed to update station", error);
      throw error;
    }
  },

  async deleteStation(id: string): Promise<void> {
    try {
      await jsonServerInstance.delete(`/gasStations/${id}`);
    } catch (error) {
      console.error("Failed to delete station", error);
      throw error;
    }
  },

  async getTicketsByGasStationId(id: string): Promise<Ticket[]> {
    try {
      const response = await jsonServerInstance.get(`/tickets?gasStationId=${id}`);
      console.log(`API response for gasStationId ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      throw error;
    }
  },
};