import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <nav>
      <LogoutButton />
    </nav>
  );
};

export default Navbar;
