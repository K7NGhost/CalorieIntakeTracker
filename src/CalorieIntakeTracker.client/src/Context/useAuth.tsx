import { useNavigate } from "react-router-dom";
import type { AuthResponse, UserProfile } from "../Models/User";
import { createContext, useEffect, useState } from "react";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string, username: string) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    password: string,
    username: string
  ) => {
    await registerAPI(email, password, username)
      .then((res: any) => {
        const returnedToken = res?.data?.token ?? res?.data?.accessToken;
        if (returnedToken) {
          localStorage.setItem("token", returnedToken);
          const userObj = {
            email: res?.data?.email ?? email,
            username: res?.data?.username ?? username,
            id: res?.data?.id,
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(returnedToken);
          setUser(userObj);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + returnedToken;
          toast.success("Login Success!");
          navigate("/dashboard");
        } else {
          toast.error("Invalid register response");
        }
      })
      .catch(() => toast.warning("Server error occurred"));
  };

  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res: any) => {
        const returnedToken = res?.data?.accessToken ?? res?.data?.token;
        if (res?.data?.user && returnedToken) {
          localStorage.setItem("token", returnedToken);

          const userObj = {
            id: res.data.user.id,
            email: res.data.user.email,
            username: res.data.user.username,
          };

          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(returnedToken);
          setUser(userObj);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + returnedToken;

          toast.success("Login Success!");
          navigate("/dashboard");
        } else {
          toast.error("Invalid login response");
        }
      })
      .catch(() => toast.warning("Server error occurred"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const isLoggedIn = () => Boolean(token && user);

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
