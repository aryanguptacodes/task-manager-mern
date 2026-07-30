import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getCurrentUser() {
    try {
      const { data } = await api.get("/user/profile");

      setUser(data.user);
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in (normal)
        setUser(null);
        return;
      }
      toast.error(error.response?.data?.message || "Something went wrong");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const { data } = await api.post("/auth/logout");
      setUser(null);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }
  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    user,
    loading,
    setUser,
    refreshUser: getCurrentUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
