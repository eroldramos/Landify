import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/appStore";

const UnauthenticatedRoutes = () => {
  const { auth } = useAuthStore();
  return !auth?.accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default UnauthenticatedRoutes;
