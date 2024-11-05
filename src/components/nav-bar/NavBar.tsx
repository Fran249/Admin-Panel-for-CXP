import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Image,
  File,
  // Users,
  LogOutIcon,
  ChevronRight,
  FolderPlus,
  ImagePlus,
  FilePlus,
  // UserPlus,
  ArrowLeft,
  Settings,
  Fullscreen,
  X,
  UserPlus,
  Users,
  Package,
} from "lucide-react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { Drawer, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const appWindow = getCurrentWebviewWindow()

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
    {
      route: "servicios",
      name: "Servicios",
      icon: <Package />, // Usuarios con un "+" para agregar consultores
    },
  ];
  const cargarArray = [
    {
      route: "publicaciones/upload",
      name: "Publicaciones",
      icon: <FilePlus />, // Archivo con un "+" para indicar cargar publicaciones
    },
    {
      route: "proyectos/upload",
      name: "Proyectos",
      icon: <FolderPlus />, // Carpeta con un "+" para cargar proyectos
    },
    {
      route: "imagenes/upload",
      name: "Imagenes",
      icon: <ImagePlus />, // Imagen con un "+" para cargar imágenes
    },
    {
      route: "archivos/upload",
      name: "Archivos",
      icon: <FilePlus />, // Archivo con un "+" para cargar archivos
    },
    {
      route: "consultores/upload",
      name: "Consultores",
      icon: <UserPlus />, // Usuarios con un "+" para agregar consultores
    },
    {
      route: "servicios/upload",
      name: "Servicios",
      icon: <Package />, // Usuarios con un "+" para agregar consultores
    },
  ];
  const [showVistas, setShowVistas] = useState(false);
  const [showCargar, setShowCargar] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const location = useLocation(); // Hook para obtener la ruta actual
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await appWindow.setFullscreen(false);
      } else {
        await appWindow.setFullscreen(true);
      }
      setIsFullscreen(!isFullscreen); // Cambia el estado
    } catch (error) {
      console.error("Error al alternar pantalla completa:", error);
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

  useEffect(() => {
    const checkFullscreen = async () => {
      const fullscreen = await appWindow.isFullscreen();
      setIsFullscreen(fullscreen);
    };

    checkFullscreen();
  }, []);
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
              location.pathname === "/dashboard/archivos/upload" ||
              location.pathname === "/dashboard/servicios/upload"
                ? location.pathname
                    .split("/")
                    .reverse()
                    .join(" ")
                    .replace("dashboard", "")
                    .replace("upload", "Cargar")
                : location.pathname.startsWith("/dashboard/publicaciones/edit/") // Cambiado para usar startsWith
                ? "Editar publicación" // Aquí se maneja la ruta de edición
                : location.pathname.startsWith("/dashboard/proyectos/edit/")
                ? "Editar proyecto"
                : location.pathname.startsWith("/dashboard/consultores/edit/")
                ? "Editar consultor"
                : location.pathname.startsWith("/dashboard/servicios/edit/")
                ? "Editar servicio"
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
            <h3 className="font-semibold text-xl">Explorar</h3>
            <ChevronRight
              className={`duration-300 ${showVistas ? "rotate-180" : ""}`}
            />
          </button>

          {showVistas &&
            vistasArray.map((item, index) => (
              <motion.div
                key={index}
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
            <h3 className="font-semibold text-xl">Cargar</h3>
            <ChevronRight
              className={`duration-300 ${showCargar ? "rotate-180" : ""}`}
            />
          </button>
          {showCargar &&
            cargarArray.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: index / 10 }}
                variants={stackVariants}
                className=" "
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
        <div className="flex justify-center items-center">
          <Tooltip title="Cerrar sesión" className="mr-5">
            <button onClick={handleLogOut}>
              <LogOutIcon />
            </button>
          </Tooltip>
        </div>
      </nav>
      <Drawer
        anchor="bottom"
        open={openConfig}
        onClose={() => setOpenConfig(false)}
      >
        <div className="relative w-full flex justify-start items-center bg-neutral-800 text-neutral-200 h-80">
          <div className="">
            <button
              onClick={toggleFullscreen}
              className="flex justify-center items-center gap-2 border-[.5px] border-neutral-100 rounded-lg p-2 hover:text-neutral-800 hover:border-neutral-800 hover:bg-neutral-200 duration-300 transition-colors"
            >
              <Fullscreen />{" "}
              <h3 className="font-semibold font-archivo">
                {isFullscreen ? "Minimizar" : "Fullscreen"}
              </h3>
            </button>
          </div>
          <Tooltip
            title="Cerrar"
            className="absolute top-10 right-10 text-neutral-100"
          >
            <button onClick={() => setOpenConfig(false)}>
              <X />
            </button>
          </Tooltip>
        </div>
      </Drawer>
      <div className="flex justify-center items-center p-2 m-2 fixed bottom-5 right-0">
        <Tooltip title="Configuracion">
          <button onClick={() => setOpenConfig(true)}>
            <Settings />
          </button>
        </Tooltip>
      </div>
    </>
  );
};

export default NavBar;
