import jsonServerInstance from "../api/jsonServerInstance";

export const fetchUserData = async () => {
    try {
        const response = await await jsonServerInstance.get("/customers");
        return response.data;
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
};
