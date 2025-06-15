import { useCallback, useState } from "react";
import { useStationStore } from "../store/stationStore";
import { gasStationService } from "../services/gasStationService";
import type { GasStation } from "../interface/GasStation";
import { useAuthStore } from "../store/authStore";

export const useStationAdmin = () => {
  const { setStations, updateStationStock } = useStationStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    if (user?.role !== "admin") return;
    setIsLoading(true);
    try {
      const stations = await gasStationService.getStations();
      setStations(stations);
    } catch (err) {
      setError("Failed to fetch stations");
    } finally {
      setIsLoading(false);
    }
  }, [setStations, user]);

  const createStation = useCallback(
    async (station: Omit<GasStation, "id">) => {
      if (user?.role !== "admin") return;
      setIsLoading(true);
      try {
        const newStation = await gasStationService.createStation(station);
        setStations([...useStationStore.getState().stations, newStation]);
      } catch (err) {
        setError("Failed to create station");
      } finally {
        setIsLoading(false);
      }
    },
    [setStations, user]
  );

  const updateStation = useCallback(
    async (id: string, station: Partial<GasStation>) => {
      if (user?.role !== "admin") return;
      setIsLoading(true);
      try {
        const updatedStation = await gasStationService.updateStation(id, station);
        setStations(
          useStationStore.getState().stations.map((s) =>
            s.id === id ? updatedStation : s
          )
        );
      } catch (err) {
        setError("Failed to update station");
      } finally {
        setIsLoading(false);
      }
    },
    [setStations, user]
  );

  const deleteStation = useCallback(
    async (id: string) => {
      if (user?.role !== "admin") return;
      setIsLoading(true);
      try {
        await gasStationService.deleteStation(id);
        setStations(useStationStore.getState().stations.filter((s) => s.id !== id));
      } catch (err) {
        setError("Failed to delete station");
      } finally {
        setIsLoading(false);
      }
    },
    [setStations, user]
  );

  const filterStations = useCallback(
    (zone?: string, fuelType?: string, minStock?: number) => {
      let filteredStations = useStationStore.getState().stations;
      if (zone) {
        filteredStations = filteredStations.filter((s) => s.zone === zone);
      }
      if (fuelType) {
        filteredStations = filteredStations.filter((s) =>
          s.services.some((service) => service.name === fuelType)
        );
      }
      if (minStock !== undefined) {
        filteredStations = filteredStations.filter((s) =>
          s.services.some((service) => service.stock >= minStock)
        );
      }
      return filteredStations;
    },
    []
  );

  return {
    fetchStations,
    createStation,
    updateStation,
    deleteStation,
    filterStations,
    isLoading,
    error,
  };
};