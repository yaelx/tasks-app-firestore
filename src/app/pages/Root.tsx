import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner";

export default function Root() {
  const { loading } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {loading && <Spinner />}
      <Outlet />
    </div>
  );
}
