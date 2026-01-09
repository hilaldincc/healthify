import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectIsRefreshing,
} from "../redux/auth/authSelectors";

import Loader from "../components/Loader/Loader"; //LOADER IMPORT

export default function PrivateRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);

  // Refresh sırasında tam ekran loader göster
  if (isRefreshing) {
    return <Loader full size={60} />;
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
}