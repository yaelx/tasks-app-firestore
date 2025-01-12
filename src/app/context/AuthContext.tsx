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
// import { fakeAuthProvider } from "../auth";
import { auth, createUserFirestore, db } from "../firebase";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Spinner } from "../components/Spinner";

const wait = (t: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, t));

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string, callback?: () => void) => void;
  signout: (callback?: () => void) => void;
  createUser: (
    username: string,
    email: string,
    password: string,
    callback?: () => void
  ) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<null | User>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUser({ ...user, ...userSnapshot.data() });
        } else {
          setUser(user); // Fallback if no Firestore data
        }
      } else {
        setUser(null);
        console.log("user is logged out");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const createUser = async (
    username: string,
    email: string,
    password: string,
    callback?: () => void
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserFirestore(
        username,
        email,
        password
      );
      console.log("User created:", userCredential.user);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
      callback && callback();
    }
  };

  const signin = async (
    email: string,
    password: string,
    callback?: () => void
  ) => {
    console.log("login action\n");
    setLoading(() => true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      setUser(userCredential.user);
    } catch (error: any) {
      console.error("Sign-in error:", error.code, error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      //setLoading(false);
      callback && callback();
    }
  };

  const signout = async (callback?: () => void) => {
    console.log("signout action\n");
    setLoading(true);
    try {
      await signOut(auth);
      console.log("Signed out successfully");
      setUser(null);
    } catch (e) {
      console.error("Error signing out: ", e);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      callback && callback();
    }
  };

  // const value = React.useMemo(
  //   () => ({ user, signin, signout, createUser, loading }),
  //   []
  // );

  return (
    <AuthContext.Provider
      value={{ user, signin, signout, createUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return React.useContext(AuthContext);
};

export const RequireAuth: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!user) {
    console.log("context has no user yet");
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};
