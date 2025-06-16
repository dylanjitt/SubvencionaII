import { getGasStations } from "../services/gasStationsService";
import type { User } from "../interface/userInterface";

export const fetchStationNames = async (
  setGasStationNames: (names: string[]) => void,
  user: User
) => {
  try {
    const stations = await getGasStations();
    
    const filteredStations = stations.filter((station:any) => station.userId === user.id);    
    
    const names = ["all", ...filteredStations.map((station:any)  => station.name)];
    console.log('stationNames:',names)
    setGasStationNames(names);
  } catch (error) {
    console.error('Error fetching station names:', error);
    setGasStationNames([]);
  }
};