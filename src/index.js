import React from "react";
import ReactDOM from "react-dom/client";
// CSS
import "./index.css";
import App from "./App";
import ContextProvider from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
