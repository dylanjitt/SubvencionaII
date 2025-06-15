import {
  AppBar, Toolbar, CardMedia, Button, Grid,
  CardActionArea, Avatar, Popover, List, Box
} from "@mui/material";
import { Notifications, NotificationsActive } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import gasolinaYaLogo from "../assets/gasolinaYaLogo.png";
import NotificationNavBarComponent from "../components/navBar/NotificationNavBarComponent";
import { useAuthStore } from "../store/authStore";
import { useSnackbarEnqueue } from "../hooks/useSnackbarEnqueue";

const Navbar = () => {
  const { logoutUser, user } = useAuthStore();
  const navigate = useNavigate();
  const { enqueueAlertVariant } = useSnackbarEnqueue();

  const [anchorNotif, setAnchorNotif] = useState<HTMLButtonElement | null>(null);
  const [anchorUser, setAnchorUser] = useState<HTMLButtonElement | null>(null);

  const handleNotifClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorNotif(event.currentTarget as unknown as HTMLButtonElement | null);
    enqueueAlertVariant(notifications[0].message, "info");
  };
  const handleUserClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorUser(event.currentTarget as unknown as HTMLButtonElement | null);
  };
  const handleNotifClose = () => {
    setAnchorNotif(null);
  }

  const handleUserClose = () => {
    setAnchorUser(null);
  };

  const logOut = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };
  const navigateHome = () => navigate('/dashboard');

  const notifications = [
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "New",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "prueba de notificación",
      read: true,
      type: "Confirm",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "Confirmed",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "prueba de notificación",
      read: true,
      type: "Cancel",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "Next",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "prueba de notificación",
      read: true,
      type: "Finished",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: false,
      type: "Stock",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "Stock",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "Stock",
      gasSationName: "GasStation_3ba14790"
    },
    {
      message: "hola, esta es una notificación",
      read: true,
      type: "Stock",
      gasSationName: "GasStation_3ba14790"
    }];

  const notReadedNotifications = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "white", height: 70, zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between" width="100%">
          <Grid >
            <CardActionArea onClick={navigateHome}>
              <CardMedia component="img" height="70" image={gasolinaYaLogo}
                sx={{ width: 70, objectFit: 'contain' }} alt="logo" />
            </CardActionArea>
          </Grid>
          <Grid >
            <Grid container alignItems="center" spacing={2}>
              <Grid >
                <Avatar
                  onClick={handleNotifClick}
                  sx={{ cursor: 'pointer', width: 40, height: 40 }}
                >
                  {notReadedNotifications === 0 ? <Notifications /> : <NotificationsActive />}
                </Avatar>
              </Grid>
              <Grid >
                <Avatar
                  onClick={handleUserClick}
                  sx={{ cursor: 'pointer', width: 40, height: 40 }}
                >
                  {user.firstName.charAt(0)}
                </Avatar>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>

      <Popover
        open={Boolean(anchorNotif)}
        anchorEl={anchorNotif}
        onClose={handleNotifClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 400, height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #ddd',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 1
          }}>
            <strong>Notificaciones</strong> ({notReadedNotifications} sin leer)
          </Box>

          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            <List dense>
              {notifications.map((n, i) => (
                <NotificationNavBarComponent
                  key={i}
                  message={n.message}
                  read={n.read}
                  type={n.type}
                  gasSationName={n.gasSationName}
                  onArchive={() => console.log("Archive notification", n.message)}
                />
              ))}
            </List>
          </Box>
        </Box>
      </Popover>


      <Popover
        open={Boolean(anchorUser)}
        anchorEl={anchorUser}
        onClose={handleUserClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: 100, p: 1 }}>
          <Button variant="outlined" fullWidth onClick={logOut}>Logout</Button>
        </Box>
      </Popover>
    </AppBar>
  );
};
export default Navbar;
