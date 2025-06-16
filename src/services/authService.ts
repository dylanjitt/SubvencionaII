import jsonServerInstance from "../api/jsonServerInstance";

export const login = async (email: string, password: string) => {
  const response = await jsonServerInstance.get("/users", {
    params: { email, password },
  });
  return response.data[0];
};