import React from "react";
import ReactDOM from "react-dom/client";
import AppRoot from "./AppRoot";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

if ("serviceWorker" in navigator && import.meta.env.DEV) {
  navigator.serviceWorker
    .getRegistrations()
    .then(registrations => registrations.forEach(registration => registration.unregister()))
    .then(() => caches?.keys?.())
    .then(keys => keys?.forEach(key => caches.delete(key)))
    .catch(() => {});
}
