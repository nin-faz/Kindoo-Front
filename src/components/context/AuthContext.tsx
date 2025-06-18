import React, {useState, createContext, useEffect, ReactNode} from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "../../types";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

const LOGIN_USER = gql`
  mutation Login($p_username: String!, $p_password: String!) {
    login(p_username: $p_username, p_pass: $p_password) 
  }
`;

const FIND_USER_BY_ID = gql`
  query FindOneById($p_id: String!) {
    findOneById(p_id: $p_id) {
      id
      userName
    }
  }
`;

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => void;
    logout: () => void;
    verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}



const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const [loginMutation] = useMutation(LOGIN_USER);
  const [findUserById] = useLazyQuery(FIND_USER_BY_ID);

  

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
      if (decodedUser) {
        // Vérifie si l'utilisateur existe en base
        const { data } = await findUserById({
          variables: { p_id: decodedUser.id },
          fetchPolicy: 'network-only',
        });
        if (data?.findOneById) {
          setUser(data.findOneById);
          localStorage.setItem("user", JSON.stringify(data.findOneById));
          return true;
        } else {
          logout();
          return false;
        }
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

  const decodeToken = (token: string): User | null => {
    if (!token) {
        console.error("No token provided for decoding");
        return null;
    } 
    try {
        const decoded: any = jwtDecode(token);
        return {
            userName: decoded.username,
            id: decoded.sub,
        };
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }

};

  

    const login = async (username: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: {
          p_username: username,
          p_password: password,
        },
      });
      if (data?.login) {
        setToken(data.login);
        localStorage.setItem("token", data.login);
      }
    } catch (error: any) {
      console.error("Login failed", error);
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