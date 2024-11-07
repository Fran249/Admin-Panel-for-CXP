// src/context/UserContext.tsx

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false); // Nuevo estado para rastrear redirección
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
      setUser(userCredential);

      if (userCredential) {
        // Solo redirigir si no hemos redirigido antes
        if (!hasRedirected) {
          console.log('Usuario autenticado:', userCredential);
          navigate('/view-picker');
          setHasRedirected(true); // Marcar como redirigido
        }
      } else {
        console.log('No hay usuario autenticado');
        setHasRedirected(false); // Reiniciar si el usuario se desconecta
      }
    });

    return () => unsubscribe();
  }, [navigate, hasRedirected]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
