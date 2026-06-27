import { createTheme } from "@mui/material/styles";

export function criarTema(modo) {
  const isDark = modo === "dark";

  return createTheme({
    palette: {
      mode: modo,
      primary: {
        main: isDark ? "#7DD3A8" : "#2E7D32",
        contrastText: isDark ? "#102015" : "#FFFFFF"
      },
      secondary: {
        main: isDark ? "#F2C078" : "#B65C00"
      },
      background: {
        default: isDark ? "#101413" : "#F4F6F3",
        paper: isDark ? "#171D1B" : "#FFFFFF"
      },
      success: {
        main: isDark ? "#77C593" : "#2E7D32"
      }
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily: ["Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"].join(","),
      h4: {
        letterSpacing: 0,
        lineHeight: 1.15
      },
      button: {
        textTransform: "none",
        fontWeight: 700
      }
    },
    components: {
      MuiCard: {
        defaultProps: {
          elevation: 0
        },
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(16,24,20,0.08)"}`,
            backgroundImage: "none"
          }
        }
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true
        }
      },
      MuiFab: {
        defaultProps: {
          disableRipple: false
        }
      }
    }
  });
}
