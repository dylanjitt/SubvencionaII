import { AppBar, Toolbar, IconButton, CardMedia, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
interface NavbarProps {
  onMenuClick: () => void;
}
import gasolinaYaLogo from "../assets/gasolinaYaLogo.png";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
interface NavbarProps {
  onMenuClick: () => void;
}
const Navbar = ({ onMenuClick }: NavbarProps) => {
  const {logoutUser,user}=useAuthStore()
  const navigate = useNavigate();

  const logOut=()=>{
    logoutUser()
    navigate('/login', {
      replace: true,
    });
  }
  const goToReports=()=>{
    navigate('/admin/reports')
  }
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor:"white", height:70, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"

          onClick={onMenuClick}
          sx={{color:"black", mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />

        </IconButton>
        <CardMedia
            component="img"
            height="70"
            image={gasolinaYaLogo}
            sx={{width:70, objectFit: 'contain' }}
            alt="green iguana"
          />
          {/* div para separar la parte derecha de la izquierda de los botones del navbar */}
          <div style={{width:'100%'}}/>

          {/* botones de la parte derecha */}
          <div style={{display:'flex', padding:20}}>
          {user.role==='admin'?
          <Button onClick={goToReports} >Reportes</Button>
          :
          <Button >Historial</Button>
          }
          <Button onClick={logOut} sx={{width:160}} variant="outlined" color="error">Cerrar sesion</Button>
          </div>
          
      </Toolbar>


    </AppBar>
  );
};

export default Navbar;