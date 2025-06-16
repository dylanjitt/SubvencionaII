import jsonServerInstance from "../api/jsonServerInstance";
import type { GasStation } from "../interface/GasStation";

export const gasStationService = {
  async getStations(): Promise<GasStation[]> {
    try {
      const response = await jsonServerInstance.get("/gasStations");
      return response.data;
    } catch (error) {
      throw console.log("Failed to fetch stations");
    }
  },

  async getStationById(id: string): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.get(`/gasStations/${id}`);
      return response.data;
    } catch (error) {
      throw console.log("Failed to fetch stations");
    }
  },

  async createStation(station: Omit<GasStation, "id">): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.post("/gasStations", station);
      return response.data;
    } catch (error) {
      throw console.log("Failed to create station");
    }
  },

  async updateStation(
    id: string,
    station: Partial<GasStation>,
  ): Promise<GasStation> {
    try {
      const response = await jsonServerInstance.patch(
        `/gasStations/${id}`,
        station,
      );
      return response.data;
    } catch (error) {
      throw console.log("Failed to update station");
    }
  },

  async deleteStation(id: string): Promise<void> {
    try {
      await jsonServerInstance.delete(`/gasStations/${id}`);
    } catch (error) {
      throw console.log("Failed to delete station");
    }
  },
};
