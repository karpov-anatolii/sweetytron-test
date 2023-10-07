import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DeviceStore from "./store/DeviceStore";
import UserStore from "./store/UserStore";
import "./index.css";
import OrderStore from "./store/OrderStore";
import InfoStore from "./store/InfoStore";

export const Context = React.createContext(null);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      device: new DeviceStore(),
      order: new OrderStore(),
      info: new InfoStore(),
    }}
  >
    <App />
  </Context.Provider>
);
