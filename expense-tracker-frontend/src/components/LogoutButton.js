import React from "react";
import { logout } from "../services/api";

const LogoutButton = () => {
  return <button onClick={logout}>Logout</button>;
};

export default LogoutButton;
