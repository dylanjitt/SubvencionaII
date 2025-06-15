import jsonServerInstance from "../api/jsonServerInstance";

export const getTicketsData = async (adminId: string, ) => {
  const response = await jsonServerInstance.get("/tickets", {
    // params: { adminId },
  });
  return response.data;
};