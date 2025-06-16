import { create } from "zustand";
import type { GasStation } from "../interface/GasStation";

interface StationState {
  stations: GasStation[];
  setStations: (stations: GasStation[]) => void;
  updateStationStock: (
    stationId: string,
    serviceName: string,
    stock: number
  ) => void;
}

export const useStationStore = create<StationState>((set) => ({
  stations: [],
  setStations: (stations) => set({ stations }),
  updateStationStock: (stationId, serviceName, stock) =>
    set((state) => ({
      stations: state.stations.map((station) =>
        station.id === stationId
          ? {
              ...station,
              services: station.services.map((service) =>
                service.name === serviceName ? { ...service, stock } : service
              ),
            }
          : station
      ),
    })),
}));