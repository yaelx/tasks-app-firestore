import React, { ChangeEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../context/AuthContext";

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const navigate = useNavigate();
  let auth = useAuth();

  // const [username, setUsername] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;
  const [error, setError] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

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
    try {
      if (password !== confirmPassword) {
        alert("Passwords did not match.");
        return;
      }

      await auth.createUser(displayName, email, password, () => {
        resetFormFields();
        navigate(`/tasks`);
      });
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        alert("Email already exists!");
      }
      setError((e as Error).message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
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
            height: "60vh",
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel htmlFor="displayName-input">displayName</InputLabel>
            <OutlinedInput
              id="displayName-input"
              aria-describedby="displayName-input"
              value={email}
              onChange={
                handleChange
                // (e: React.ChangeEvent<HTMLInputElement>) =>
                // setEmail(e.target.value)
              }
              placeholder="Enter Your Name"
              required
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel htmlFor="email-input">Email address</InputLabel>
            <OutlinedInput
              id="email-input"
              aria-describedby="email-input"
              value={email}
              onChange={
                handleChange
                // (e: React.ChangeEvent<HTMLInputElement>) =>
                // setEmail(e.target.value)
              }
              required
            />
            <FormHelperText id="my-helper-text">
              We'll never share your email.
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel size="small" htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-password"
              // sx={{ m: 1, width: "25ch" }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={
                handleChange
                // (e: React.ChangeEvent<HTMLInputElement>) =>
                // setPassword(e.target.value)
              }
              placeholder="Password"
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
          <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
            <InputLabel
              size="small"
              htmlFor="standard-adornment-confirmPassword"
            >
              confirmPassword
            </InputLabel>
            <OutlinedInput
              id="standard-adornment-confirmPassword"
              // sx={{ m: 1, width: "25ch" }}
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={
                handleChange
                // (e: React.ChangeEvent<HTMLInputElement>) =>
                // setPassword(e.target.value)
              }
              placeholder="Confirm Password"
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
            sx={{ width: "30ch", m: 1 }}
          >
            Sign up
          </Button>

          {error && <Typography variant="body1">{error}</Typography>}

          <Box sx={{ m: 2, ml: 2 }}>
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default Signup;
