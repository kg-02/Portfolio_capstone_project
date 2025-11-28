// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#028090" },
    secondary: { main: "#00A896" },
    text: { primary: "#05668D" },
    background: { default: "#f5f8fa", paper: "#ffffff" },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          color: "#05668D",
          background: "#ffffff",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& .MuiInputLabel-root": { color: "#028090" },
          "& .MuiInputBase-input": { color: "#05668D" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#00A896" },
            "&:hover fieldset": { borderColor: "#02C39A" },
            "&.Mui-focused fieldset": { borderColor: "#028090" },
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          padding: "10px 20px",
          fontWeight: "bold",
        },
        containedPrimary: {
          backgroundColor: "#02C39A",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#00A896",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: { color: "#028090" },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: { color: "#05668D" },
      },
    },
  },
});

export default theme;
