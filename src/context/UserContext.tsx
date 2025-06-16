import React, { createContext, useContext, useState, type ReactNode } from 'react';

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
  const [user, setUser] = useState<User>({
    id: 'ae1e9c7c-7cb3-4249-8fa4-095353e4c137',
    userId: '6c2a7f28-503e-4742-9a88-5cd9df93b562',
    identificationNumber: '9421192',
    licenseNumber: '51072',
    cars: ['XLK743'],
  });

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
