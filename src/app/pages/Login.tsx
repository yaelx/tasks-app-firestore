import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Typography } from "@mui/material";
import { Spinner } from "../components/Spinner";

const Login = () => {
  const navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await auth.signin(email, password, () => {
        navigate("/tasks", { replace: true });
      });
      x;
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <>
      <main>
        <section>
          <div>
            <p> Focus App </p>
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button type="submit">Login</button>
              </div>
              {error && <Typography variant="body1">{error}</Typography>}
            </form>

            <p className="text-sm text-white text-center">
              No account yet? <NavLink to="/signup">Sign up</NavLink>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
