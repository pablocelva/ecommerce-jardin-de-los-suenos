import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.render(
    <AppProvider>
      <App />
    </AppProvider>,
    document.getElementById("root")
);