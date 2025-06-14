import {
  Box,  
  CssBaseline,
  Toolbar,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import { useState } from "react";

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar onMenuClick={handleDrawerToggle} />
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};