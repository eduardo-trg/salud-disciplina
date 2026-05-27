import { createContext, useContext } from 'react';
export const UserContext = createContext<string>('default-user');
export const useUserId = () => useContext(UserContext);