import { useEffect, useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import { criarTema } from "./theme";

function AppRoot() {
  const [modoTema, setModoTema] = useState(
    () => localStorage.getItem("lista_mercado_tema") || "light"
  );
  const [installPrompt, setInstallPrompt] = useState(null);
  const theme = useMemo(() => criarTema(modoTema), [modoTema]);

  useEffect(() => {
    function capturarPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    window.addEventListener("beforeinstallprompt", capturarPrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturarPrompt);
  }, []);

  function alternarTema() {
    setModoTema(modoAtual => {
      const proximoModo = modoAtual === "light" ? "dark" : "light";
      localStorage.setItem("lista_mercado_tema", proximoModo);
      return proximoModo;
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App
        modoTema={modoTema}
        onAlternarTema={alternarTema}
        podeInstalar={Boolean(installPrompt)}
        onInstalarApp={async () => {
          if (!installPrompt) return;
          await installPrompt.prompt();
          setInstallPrompt(null);
        }}
      />
    </ThemeProvider>
  );
}

export default AppRoot;
