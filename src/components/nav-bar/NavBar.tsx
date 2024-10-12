import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Image,
  File,
  Users,
  LogOut,
  LogOutIcon,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const NavBar = () => {
  const navArray = [
    {
      route: "publicaciones",
      name: "Publicaciones",
      icon: <FileText />,
    },
    {
      route: "proyectos",
      name: "Proyectos",
      icon: <Briefcase />,
    },
    {
      route: "imagenes",
      name: "Imagenes",
      icon: <Image />,
    },
    {
      route: "archivos",
      name: "Archivos",
      icon: <File />,
    },
    {
      route: "consultores",
      name: "Consultores",
      icon: <Users />,
    },
  ];

  const location = useLocation(); // Hook para obtener la ruta actual

  // Variantes de animación para las letras
  const letterVariants = {
    hidden: { opacity: 0, y: 20 }, // Comienza oculto y desplazado hacia abajo
    visible: { opacity: 1, y: 0 }, // Se anima a su posición normal
  };

  const handleLogOut = () => {
    signOut(auth);
  };

  return (
    <>
      <nav className="w-full h-16 hover:h-40 hover:bg-neutral-900 hover:text-neutral-200 fixed z-30 duration-300 bg-neutral-100 flex">
        <div className="w-1/4 flex justify-start pl-2 items-center gap-10 ">
          <Tooltip title="Cerrar sesión">
            <button onClick={handleLogOut}>
              <LogOutIcon />
            </button>
          </Tooltip>
          <div className="flex items-center font-bold text-xl">
            <h3 className="font-bold first-letter:uppercase">
              {location.pathname === "/dashboard/publicaciones/upload" ||
              location.pathname === "/dashboard/proyectos/upload" ||
              location.pathname === "/dashboard/consultores/upload" ||
              location.pathname === "/dashboard/imagenes/upload" ||
              location.pathname === "/dashboard/archivos/upload"
                ? location.pathname.split("/").reverse().join(" ").replace('dashboard', '').replace('upload', 'cargar')
                : location.pathname.replace("dashboard", "").split("/")}
            </h3>
          </div>
        </div>
        <div className="w-3/4 flex justify-center items-center gap-16">
          {navArray.map((item, index) => (
            <Tooltip title={item.name} key={index}>
              <div className="flex items-center gap-2">
                <Link
                  to={item.route}
                  className={`hover:bg-neutral-900 hover:text-white border-[.5px] transition-colors duration-300 p-2 font-bold text-xl rounded-full first-letter:uppercase ${
                    location.pathname === `/dashboard/${item.route}`
                      ? "bg-neutral-900 text-white"
                      : "bg-transparent text-neutral-400"
                  }`}
                >
                  {item.icon}
                </Link>
              </div>
            </Tooltip>
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
