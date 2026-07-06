import { Navigate } from "react-router-dom";
import useAuthStore from "../context/AuthStore";
import ChatStore from "../context/ChatStore";
import { useEffect } from "react";
const ProtectedRoute = ({ children }) => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const getUser = useAuthStore((state) => state.getUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoading2 = ChatStore((state) => state.isLoading);
  useEffect(() => {
    getUser();
  }, []);
  if (isLoading || isLoading2) {
    return <div>Loading...</div>;
  }
  if (!userInfo) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
