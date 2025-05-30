import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* ✅ Only One BrowserRouter Here */}
    <App />
  </BrowserRouter>
);
