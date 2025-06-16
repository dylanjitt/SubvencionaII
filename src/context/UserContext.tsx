import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchUserData } from '../services/customerService';
interface User {
  id: string;
  userId: string;
  identificationNumber: string;
  licenseNumber: string;
  cars: string[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (authUser?.id) {
        try {
          const response = await fetchUserData();
          const customerData = response.find((customer: User) => customer.userId === authUser.id);

          if (customerData) {
            setUser(customerData);
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
    };

    fetchData();
  }, [authUser?.id]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
};
