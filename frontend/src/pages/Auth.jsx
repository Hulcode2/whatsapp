import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/paths";
import image from "../assets/login2.png";
import image2 from "../assets/victory.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../context/AuthStore";
import useChatStore from "../context/ChatStore";
import { connectSocket, getSocket } from "../utils/socket";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const userInfo = useAuthStore((state) => state.userInfo);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.on("receive-message", (message) => {
      addMessage(message);
    });

    socket.on("receive-channel-message", (message) => {
      addMessage(message);
    });

    return () => {
      socket.off("receive-message");
      socket.off("receive-channel-message");
    };
  }, [userInfo]);
  useEffect(() => {
    if (!userInfo) return;

    connectSocket(userInfo._id);
  }, [userInfo]);
  const handleLogin = async () => {
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");

    try {
      setLoading(true);

      const { data } = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      if (!data.success) {
        return toast.error(data.message || "Login failed");
      }

      toast.success("Login success:");
      localStorage.setItem("jwt", data.accessToken);

      if (data.profileSetup) {
        navigate("/");
      } else {
        navigate("/profile");
      }
      setEmail("");
      setPassword("");

      setUserInfo(data);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  async function handleSignup() {
    if (!email.trim()) return toast.error("Email is required");
    if (!password.trim()) return toast.error("Password is required");
    if (password2.trim() !== password.trim())
      return toast.error("Confirming password is required");
    try {
      setLoading(true);

      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        email,
        password,
      });

      if (!data.success) {
        return toast.error(data.message || "Register failed");
      }
      localStorage.setItem("jwt", data.accessToken);
      toast.success(data.message || "Registration successful");
      console.log(data.message);
      navigate("/profile");
      setEmail("");
      setPassword("");
      setPassword2("");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl p-2">
        <CardContent className="grid md:grid-cols-2 p-0">
          {/* Left Side */}
          <div className="flex flex-col justify-center px-10 py-12">
            <div className="flex items-center mb-3">
              <h1 className="text-5xl font-bold">Welcome</h1>

              <img src={image2} alt="welcome" className="w-20 h-20 ml-2" />
            </div>

            <p className="text-muted-foreground mb-8">
              Fill in the details to get started with the best chat app!
            </p>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>

                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>

              {/* Login */}

              <TabsContent value="login" className="mt-6 space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>

              {/* Signup */}

              <TabsContent value="signup" className="mt-6 space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />

                <Input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Confirm Password"
                />

                <Button
                  disabled={loading}
                  onClick={handleSignup}
                  className="w-full"
                >
                  {" "}
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side */}

          <div className="hidden  md:flex items-center justify-center bg-slate-50">
            <img
              src={image}
              alt="Authentication"
              className="w-[80%] object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
