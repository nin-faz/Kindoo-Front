import React, {useState, createContext, useEffect, ReactNode} from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types"; // Adjust the import path as necessary

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

const decodeToken = (token: string): User | null => {
    if (!token) {
        console.error("No token provided for decoding");
        return null;
    } 
    try {
        const decoded: any = jwtDecode(token);
        console.log("Decoded token:", decoded);
        return {
            userName: decoded.username,
            id: decoded.sub,
        };
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }

};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const verifyToken = async (): Promise<boolean> => {
    if (!token) {
      return false;
    }
    try {
      const decodedUser = decodeToken(token);
      console.log("Decoded user:", decodedUser);
      if (decodedUser) {
        setUser(decodedUser);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token verification failed", error);
      logout();
      return false;
    }

  }

    const login = (newToken: string) => {
        setToken(newToken);
        const decodedUser = decodeToken(newToken);
        if (decodedUser) {
        setUser(decodedUser);
            console.log("User logged in:", decodedUser);
            localStorage.setItem("token", newToken);
            localStorage.setItem("user", JSON.stringify(decodedUser));
            console.log("Token and user stored in localStorage");
        } else {
        console.error("Failed to decode user from token");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    
    useEffect(() => {
        const validateOnLoad = async () => {
            if(token && !user){
                const decodedUser = decodeToken(token);
                if (decodedUser) {
                    setUser(decodedUser);
                }
                else {
                    console.error("Failed to decode user from token on load");
                    logout();
                }
            }
            if (token) {
                const isValid = await verifyToken();
                if (!isValid) {
                    logout();
                }
            }
        };
        validateOnLoad();
    }, []);

    const value = React.useMemo(() => ({
        user,
        token,
        login,
        logout,
        verifyToken,
    }), [user, token]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };