import jsonServerInstance from "../api/jsonServerInstance";

export const getGasStations = async () => {
  const response = await jsonServerInstance.get("/gasStations", {
  });
  return response.data;
};