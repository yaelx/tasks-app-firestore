import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Button, Typography } from "@mui/material";
import { Spinner } from "./Spinner";

const AuthStatus = () => {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <Box>
      {auth.loading && <Spinner />}
      <Typography variant="body1" sx={{ color: "black" }}>
        Welcome {auth.user.email}
      </Typography>
      <Button
        // size="small"
        color="success"
        // variant="text"
        onClick={async (e) => {
          e.preventDefault();
          await auth.signout(() => {
            navigate("/");
          });
        }}
      >
        Sign out
      </Button>
    </Box>
  );
};

export default AuthStatus;
