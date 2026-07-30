import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return user ? <Navigate to="/" replace /> : <Outlet />;
}
