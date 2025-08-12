import { useGetCurrentUser } from "@/services/authServices";
import { useAuthStore } from "@/store/appStore";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "../LoadingScreens/LoadingScreen";
// import { LoadingSuspense } from "../LoadingScreens";

const PrivateAdminRoutes = () => {
  const { auth } = useAuthStore();
  const currentUser = useGetCurrentUser(auth?.accessToken ? true : false);
  if (currentUser?.isLoading) return <LoadingScreen />;
  return auth?.accessToken &&
    currentUser?.data?.data.role.toUpperCase() == "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateAdminRoutes;
