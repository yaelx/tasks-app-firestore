import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    button: {
      delete: string;
      add?: string;
    };
  }
  // allow configuration using `createTheme()`
  interface ThemeOptions {
    button?: {
      delete?: string;
      add?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#6fa6f7",
    },
    secondary: {
      main: "#ced1cd",
    },
    background: {
      default: "#F4F4F4", // Light Grey
    },
    text: {
      primary: "#333333", // Dark Text
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  button: {
    add: "#71d466", // green
    delete: "#e8b533",
  },
  spacing: 8, // Base spacing unit (used in margins, paddings, etc.)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
