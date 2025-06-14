import { AppBar, Toolbar, IconButton, CardMedia } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
interface NavbarProps {
  onMenuClick: () => void;
}
import gasolinaYaLogo from "../assets/gasolinaYaLogo.png";
interface NavbarProps {
  onMenuClick: () => void;
}
const Navbar = ({ onMenuClick }: NavbarProps) => {
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
      </Toolbar>


    </AppBar>
  );
};

export default Navbar;