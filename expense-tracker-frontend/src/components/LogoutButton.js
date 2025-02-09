import React from "react";
import { logout } from "../services/api";
import { Button } from "@mui/material";

const LogoutButton = () => {
  return <Button type="submit" variant="contained" color="primary"
            onClick={logout}>Logout
          </Button>;
};

export default LogoutButton;
