import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Box, Typography } from "@mui/material";
import { theme } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import AuthStatus from "../components/AuthStatus";

const Home = () => {
  let auth = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        bgcolor: theme.palette.background.default,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ color: "black" }}>
        {auth.user ? "Welcome home" : "you are not logged in"}
      </Typography>
    </Box>
  );
};

export default Home;
