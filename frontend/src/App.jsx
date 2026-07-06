import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useAuthStore from "./context/AuthStore";
import useChatStore from "./context/ChatStore";
import { connectSocket, disconnectSocket } from "./utils/socket";
function App() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const getUser = useAuthStore((state) => state.getUser);
  const getUserChannels = useChatStore((state) => state.getUserChannels);
  const getUserDm = useChatStore((state) => state.getUserDm);

  useEffect(() => {
    if (!userInfo) return;

    connectSocket(userInfo._id);

    return () => disconnectSocket();
  }, [userInfo]);
  useEffect(() => {
    getUser();
    getUserDm();
    getUserChannels();
  }, [getUser, getUserDm, getUserChannels]);
  return (
    <BrowserRouter>
      <div className="  h-screen ">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      </div>
    </BrowserRouter>
  );
}

export default App;
