import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/reduxHooks";

export function PrivateRoute() {
  const { user } = useAppSelector((state) => state.auth);

  // Si no hay usuario, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, renderiza las rutas hijas
  return <Outlet />;
}
