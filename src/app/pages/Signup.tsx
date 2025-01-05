import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        const userid = userCredential.user.uid;
        setTimeout(() => {
          navigate(`/tasks`);
        }, 3000);
        try {
          await setDoc(doc(db, "users", userid), {
            username: username,
            email: email,
          });
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError(`${errorCode}. ${errorMessage}`);
      });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ height: "100%" }}>
        <h1> Sign Up </h1>
        <Box
          component="form"
          autoComplete="off"
          sx={{
            display: "grid",
            // gridTemplateColumns: { sm: "1fr 1fr" },
            gap: 1,
            bgcolor: "#e3f7fc",
            height: "50vh",
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <FormControl sx={{ m: 2, width: "30ch" }} variant="outlined">
            <InputLabel htmlFor="my-input">Email address</InputLabel>
            <OutlinedInput
              id="my-input"
              aria-describedby="my-helper-text"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
            <FormHelperText id="my-helper-text">
              We'll never share your email.
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ m: 2, mt: 1, width: "30ch" }} variant="outlined">
            <InputLabel size="small" htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-password"
              // sx={{ m: 1, width: "25ch" }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <Button
            variant="contained"
            type="submit"
            onClick={onSubmit}
            sx={{ width: "30ch", m: 2 }}
          >
            Sign up
          </Button>

          {error && <Typography variant="body1">{error}</Typography>}

          <Box sx={{ m: 2, mt: 10, ml: 2 }}>
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Signup;
