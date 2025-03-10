//Package imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

//Local imports
import store, { persistor } from "./redux/store";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  </StrictMode>
);
