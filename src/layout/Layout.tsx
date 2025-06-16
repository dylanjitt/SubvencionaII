import {
  Box,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import { SnackbarProvider } from 'notistack';

import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";



export const Layout = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Navbar />
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </SnackbarProvider>
    </Box>
  );
};