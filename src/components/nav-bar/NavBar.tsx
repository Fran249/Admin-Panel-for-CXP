import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Tooltip } from "@mui/material";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useEffect, useState } from "react";

const NavBar = () => {
  const navArray = ["publicaciones", "proyectos"];
  const location = useLocation(); // Hook para obtener la ruta actual

  const handleLogOut = () => {
    signOut(auth);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#222" }} className="font-montserrat text-white font-semibold uppercase">
      <Toolbar className="relative flex justify-center items-center gap-10 w-full">
        {navArray.map((item, index) => (
          <Link
            key={index}
            to={item} // Asegúrate de que los enlaces tengan la barra inicial
            className={`${
              location.pathname.includes(item) ? "text-indigo-600" : "text-white"
            } hover:text-indigo-600 transition-all duration-300`}
          >
            {item}
          </Link>
        ))}
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
