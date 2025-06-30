import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;

  getWithProactiveAuth: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
}

interface TokenPayload {
  exp: number;
  sub: string;
  role: 'customer' | 'ong';
}

interface Usuario {
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  city: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: Usuario | null;
  role: string | null;
  loading: boolean;
  getWithProactiveAuth: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<T>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Usuario | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem('userRole');

    if (token) {
      setIsAuthenticated(true);
    
    if (storedRole) {
      setRole(storedRole);
    }

    api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do usuário:", error);
        logout();
      });
    }
    setLoading(false);
  }, []);

  const login = async (accessToken: string) => {
    const decoded = jwtDecode<TokenPayload>(accessToken);
    const normalizedRole = decoded.role.toLowerCase();
    localStorage.setItem("token", accessToken);
    localStorage.setItem('accessTokenExp', String(decoded.exp));
    localStorage.setItem('userRole', decoded.role);
    setIsAuthenticated(true);
    setRole(normalizedRole);

    try {
      const userResponse = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(userResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }


  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessTokenExp");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  function isTokenExpiringSoon(token: string): boolean {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp - now < 30; // menos de 30s
    } catch (e) {
      return true;
    }
  }

  async function refreshTokenIfNeeded(): Promise<void> {
    const token = localStorage.getItem('token');

    if ((!token || isTokenExpiringSoon(token)) && isAuthenticated) {
      try {
        const response = await api.post('/refresh', {}, { withCredentials: true });
        const newAccessToken = response.data;

        if (newAccessToken) {
          login(newAccessToken); // reaproveita a lógica do login
          console.log("refreshed!");
        }
      } catch (error) {
        console.error("Erro ao renovar token", error);
        logout(); // em caso de erro, faz logout
      }
    }
  }

  async function getWithProactiveAuth<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {

    await refreshTokenIfNeeded();

    const accessToken = localStorage.getItem('token');

    const authConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      },
      withCredentials: true
    };

    return await api(url, authConfig);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, role, getWithProactiveAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};