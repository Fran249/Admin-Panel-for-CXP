import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();

  // Si no hay usuario, redirigir a la página de inicio
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  // Si hay un usuario, renderizar los hijos (las rutas anidadas)
  return <>{children}</>;
};
