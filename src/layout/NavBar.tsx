import {
  AppBar, Toolbar, CardMedia, Button, Grid,
  CardActionArea, Avatar, Popover, List, Box
} from "@mui/material";
import { Notifications, NotificationsActive } from '@mui/icons-material';

import gasolinaYaLogo from "../assets/gasolinaYaLogo.png";
import NotificationNavBarComponent from "../components/navBar/NotificationNavBarComponent";
import { useNotifierNavBar } from "../hooks/useNotifierNavBar";

const Navbar = () => {
  const {
    user,
    notifications,
    nonReadedNotifications,
    anchorNotif,
    anchorUser,
    handleNotifClick,
    handleNotifClose,
    handleUserClick,
    handleUserClose,
    logOut,
    navigateHome,
    archiveNotification,
    goToReports
  } = useNotifierNavBar();



// import { useAuthStore } from "../store/authStore";
// import { useNavigate } from "react-router-dom";
// interface NavbarProps {
//   onMenuClick: () => void;
// }
// const Navbar = ({ onMenuClick }: NavbarProps) => {
//   const {logoutUser,user}=useAuthStore()
//   const navigate = useNavigate();

  // const logOut=()=>{
  //   logoutUser()
  //   navigate('/login', {
  //     replace: true,
  //   });
  // }
  // const goToReports=()=>{
  //   navigate('/admin/reports')
  // }
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
                  {nonReadedNotifications.length === 0 ? <Notifications /> : <NotificationsActive />}
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
            <strong>Notificaciones</strong> ({nonReadedNotifications.length} sin leer)
          </Box>

          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            <List dense>
              {notifications.map((n) => (
                <NotificationNavBarComponent
                  key={n.id}
                  message={n.message}
                  read={n.read}
                  type={n.type}
                  gasSationName={n.gasStationName}
                  onArchive={() => archiveNotification(n.id)}
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
          <Button variant="outlined" fullWidth onClick={goToReports}>Reports</Button>
        </Box>
      </Popover>
    </AppBar>
  );
};
export default Navbar;
