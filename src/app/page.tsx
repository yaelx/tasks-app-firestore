"use client";
import React from "react";
import {
  BrowserRouter,
  useNavigate,
  NavLink,
  Link,
  Routes,
  Route,
} from "react-router-dom";
import Tasks from "../app/pages/Tasks";
import Signup from "../app/pages/Signup";
import Login from "../app/pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages//ProtectedRoute";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { Box } from "@mui/material";
import AppHeader from "./components/AppHeader";
import { theme } from "./styles/theme";
import { AuthProvider, RequireAuth, useAuth } from "./context/AuthContext";
import { Spinner } from "./components/Spinner";
import Root from "./pages/Root";

const pages = [
  { name: "signup", link: "/signup" },
  { name: "login", link: "/login" },
  { name: "tasks", link: "/tasks" },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Box
            id="main-container"
            sx={{
              display: "flex",
              flex: 1,
              bgcolor: theme.palette.background.default,
              width: "100%",
              height: "100%",
            }}
          >
            <AppHeader />
            <Box
              id="pages-container"
              sx={{
                mt: "120px",
                width: "100%",
              }}
            >
              <Routes>
                <Route path="/" element={<Root />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />

                  <Route
                    path="/tasks"
                    element={
                      <RequireAuth>
                        <Tasks />
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Box>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
