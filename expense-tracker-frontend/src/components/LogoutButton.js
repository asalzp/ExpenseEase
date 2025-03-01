import React from "react";
import { logout } from "../services/api";
import { Button } from "@mui/material";

const LogoutButton = () => {
  return <Button
            type="submit" variant="contained" color="primary"
            onClick={logout}
              sx={{
                backgroundColor: "#f9b17a",
                color: "#2d3250",
                boxShadow: "0 0 10px #f9b17a",
                "&:hover": {
                  backgroundColor: "#f9b17a",
                  boxShadow: "0 0 20px #f9b17a",
                },
              }}>
                Logout
    </Button>;
};

export default LogoutButton;
