import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "!text-lg !font-semibold", // Ensure Tailwind applies styles
            style: { fontSize: "15px", fontWeight: "bold" },
          }}
        />
      </Router>
    </Provider>
  </StrictMode>
);
