// src/components/NavBar.jsx
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Tooltip } from "@mui/material";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

const NavBar = () => {
  const handleLogOut = () => {
    signOut(auth);
  };
  return (
    <AppBar position="fixed">
    <Toolbar className="relative flex justify-center items-center gap-10 w-full">
      <Link to="publicaciones">Publicaciones</Link>
      <Link to="proyectos">Proyectos</Link>
      <Tooltip title="Cerrar Sesion" className="absolute right-2 top-5">
        <button onClick={handleLogOut}>
          <LogOut className="text-white" />
        </button>
      </Tooltip>
    </Toolbar>
  </AppBar>
  );
};

export default NavBar;
