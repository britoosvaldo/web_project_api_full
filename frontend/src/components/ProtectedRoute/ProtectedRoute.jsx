import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ isLoggedIn, children }) {
  const location = useLocation();

  if (isLoggedIn) return children;

  return <Navigate to="/signin" replace state={{ from: location }} />;
}
