import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/appStore";

const PrivateRoutes = () => {
  const { auth } = useAuthStore();
  return auth?.accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
