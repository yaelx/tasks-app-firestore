import * as React from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { fakeAuthProvider } from "../auth";

type User = {
  localId?: string;
  email?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  passwordUpdatedAt?: number;
  providerUserInfo?: [
    {
      providerId: string;
      federatedId: string;
      email: string;
      rawId: string;
    }
  ];
  validSince?: string;
  lastLoginAt?: string;
  createdAt?: string;
  lastRefreshAt?: string;
};

interface AuthContextType {
  user: User | null;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  let [user, setUser] = React.useState<null | User>(null);

  let signin = (newUser: any, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  const value = React.useMemo(() => ({ user, signin, signout }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  return React.useContext(AuthContext);
};

export const RequireAuth: React.FC<AuthProviderProps> = ({ children }) => {
  const context = useAuth();
  if (!context) {
    throw new Error("No provider was provided for ProductContext");
  }
  const location = useLocation();

  if (!context.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
