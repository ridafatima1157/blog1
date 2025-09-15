//To protect certain routes in React Router so only logged-in users (with a valid token) can access them.
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default PrivateRoute;
