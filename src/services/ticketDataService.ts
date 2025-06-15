import jsonServerInstance from "../api/jsonServerInstance";

export const getTicketsData = async (admin_id: string, ) => {
  const response = await jsonServerInstance.get("/tickets", {
    params: { admin_id },
  });
  return response.data;
};