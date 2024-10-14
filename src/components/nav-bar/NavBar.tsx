import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Image,
  File,
  Users,
  LogOutIcon,
  ChevronRight,
  FolderPlus,
  ImagePlus,
  FilePlus,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const vistasArray = [
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
  const cargarArray = [
    {
      route: "publicaciones/upload",
      name: "Cargar publicaciones",
      icon: <FilePlus />, // Archivo con un "+" para indicar cargar publicaciones
    },
    {
      route: "proyectos/upload",
      name: "Cargar proyectos",
      icon: <FolderPlus />, // Carpeta con un "+" para cargar proyectos
    },
    {
      route: "imagenes/upload",
      name: "Cargar imagenes",
      icon: <ImagePlus />, // Imagen con un "+" para cargar imágenes
    },
    {
      route: "archivos/upload",
      name: "Cargar archivos",
      icon: <FilePlus />, // Archivo con un "+" para cargar archivos
    },
    {
      route: "consultores/upload",
      name: "Cargar consultores",
      icon: <UserPlus />, // Usuarios con un "+" para agregar consultores
    },
  ];
  const [showVistas, setShowVistas] = useState(false);
  const [showCargar, setShowCargar] = useState(false);
  const location = useLocation(); // Hook para obtener la ruta actual

  // Variantes de animación para las letras

  const handleShowVistas = () => {
    if (showCargar === true) {
      setShowCargar(false);
      setShowVistas(!showVistas);
    } else {
      setShowVistas(!showVistas);
    }
  };
  const handleShowCargar = () => {
    if (showVistas === true) {
      setShowVistas(false);
      setShowCargar(!showCargar);
    } else {
      setShowCargar(!showCargar);
    }
  };
  const stackVariants = {
    hidden: { opacity: 0, x: 20 }, // Comienza oculto y desplazado hacia abajo
    visible: { opacity: 1, x: 0 }, // Se anima a su posición normal
  };
  const handleLogOut = () => {
    signOut(auth);
  };
  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <>
      <nav className="w-full h-16 hover:h-40 hover:bg-neutral-900 hover:text-neutral-200 fixed z-30 duration-300 bg-neutral-100 flex">
        <div className="w-1/4 flex justify-start pl-2 items-center gap-10 ">
          {location.pathname !== "/dashboard/publicaciones" &&
            location.pathname !== "/dashboard/proyectos" &&
            location.pathname !== "/dashboard/consultores" && (
              <button onClick={handleNavigate}>
                <Tooltip title="Volver">
                  <ArrowLeft />
                </Tooltip>
              </button>
            )}

          <div className="flex items-center font-bold text-xl">
            <h3 className="font-bold first-letter:uppercase pl-2">
              {location.pathname === "/dashboard/publicaciones/upload" ||
              location.pathname === "/dashboard/proyectos/upload" ||
              location.pathname === "/dashboard/consultores/upload" ||
              location.pathname === "/dashboard/imagenes/upload" ||
              location.pathname === "/dashboard/archivos/upload"
                ? location.pathname
                    .split("/")
                    .reverse()
                    .join(" ")
                    .replace("dashboard", "")
                    .replace("upload", "cargar")
                : location.pathname.startsWith("/dashboard/publicaciones/edit/") // Cambiado para usar startsWith
                ? "Editar publicación" // Aquí se maneja la ruta de edición
                : location.pathname
                    .replace("dashboard", "")
                    .split("/")
                    .join(" ")}
            </h3>
          </div>
        </div>

        <div className="w-3/4 flex justify-start items-center gap-16">
          <button
            className="duration-300 flex items-center gap-2 rounded-lg border-[.5px] border-transparent hover:border-neutral-200 hover:border-[.5px] px-2 py-1"
            onClick={handleShowVistas}
          >
            <h3 className="font-bold text-xl">Ver</h3>
            <ChevronRight
              className={`duration-300 ${showVistas ? "rotate-180" : ""}`}
            />
          </button>

          {showVistas &&
            vistasArray.map((item, index) => (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: index / 10 }}
                variants={stackVariants}
              >
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
              </motion.div>
            ))}
          <button
            className="duration-300 flex items-center gap-2 rounded-lg border-[.5px] border-transparent hover:border-neutral-200 hover:border-[.5px] px-2 py-1"
            onClick={handleShowCargar}
          >
            <h3 className="font-bold text-xl">Cargar</h3>
            <ChevronRight
              className={`duration-300 ${showCargar ? "rotate-180" : ""}`}
            />
          </button>
          {showCargar &&
            cargarArray.map((item, index) => (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: index / 10 }}
                variants={stackVariants}
              >
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
              </motion.div>
            ))}
        </div>
        <Tooltip title="Cerrar sesión">
          <button onClick={handleLogOut} className="mr-10">
            <LogOutIcon />
          </button>
        </Tooltip>
      </nav>
    </>
  );
};

export default NavBar;
