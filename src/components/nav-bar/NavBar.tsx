import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Briefcase,
  Image,
  File,
  Users,
  LogOut,
  ChevronRight,
  FolderPlus,
  ImagePlus,
  FilePlus,
  ArrowLeft,
  Settings,
  Fullscreen,
  UserPlus,
  Package,
  Menu,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const appWindow = getCurrentWebviewWindow();

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showVistas, setShowVistas] = useState(false);
  const [showCargar, setShowCargar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const vistasArray = [
    {
      route: "publicaciones",
      name: "Publicaciones",
      icon: <FileText size={20} />,
    },
    { route: "proyectos", name: "Proyectos", icon: <Briefcase size={20} /> },
    { route: "imagenes", name: "Imágenes", icon: <Image size={20} /> },
    { route: "archivos", name: "Archivos", icon: <File size={20} /> },
    { route: "consultores", name: "Consultores", icon: <Users size={20} /> },
    { route: "servicios", name: "Servicios", icon: <Package size={20} /> },
  ];

  const cargarArray = [
    {
      route: "publicaciones/upload",
      name: "Publicaciones",
      icon: <FilePlus size={20} />,
    },
    {
      route: "proyectos/upload",
      name: "Proyectos",
      icon: <FolderPlus size={20} />,
    },
    {
      route: "imagenes/upload",
      name: "Imágenes",
      icon: <ImagePlus size={20} />,
    },
    {
      route: "archivos/upload",
      name: "Archivos",
      icon: <FilePlus size={20} />,
    },
    {
      route: "consultores/upload",
      name: "Consultores",
      icon: <UserPlus size={20} />,
    },
    {
      route: "servicios/upload",
      name: "Servicios",
      icon: <Package size={20} />,
    },
  ];

  const handleShowVistas = () => {
    setShowVistas(!showVistas);
    setShowCargar(false);
  };

  const handleShowCargar = () => {
    setShowCargar(!showCargar);
    setShowVistas(false);
  };

  const toggleFullscreen = async () => {
    try {
      const newFullscreenState = !isFullscreen;
      await appWindow.setFullscreen(newFullscreenState);
      setIsFullscreen(newFullscreenState);
    } catch (error) {
      console.error("Error al alternar pantalla completa:", error);
    }
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

  const stackVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav
      className={`z-30 h-screen bg-neutral-800 text-neutral-200 fixed left-0 top-0 flex flex-col transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-16"
      } hover:w-72 hover:bg-neutral-900 hover:text-neutral-200 group`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={`flex flex-col gap-4 overflow-hidden ${
          isExpanded ? "p-4" : ""
        }`}
      >
        <div className="flex items-center justify-between">

            {isExpanded === false && (
              <div className="flex justify-center items-center w-full mt-8">
                {" "}
                <Menu />
              </div>
            )}
            {isExpanded && (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold whitespace-nowrap first-letter:uppercase"
              >
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
                  : location.pathname.startsWith(
                      "/dashboard/publicaciones/edit/"
                    ) // Cambiado para usar startsWith
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
              </motion.h1>
            )}

          {isExpanded &&
            location.pathname !== "/dashboard/publicaciones" &&
            location.pathname !== "/dashboard/proyectos" &&
            location.pathname !== "/dashboard/consultores" && (
              <button
                onClick={handleNavigate}
                className="p-2 rounded-full hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
        </div>

        <button
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          onClick={handleShowVistas}
        >
          {isExpanded ? (
            <>
              <span className="font-semibold whitespace-nowrap">Explorar</span>
              <ChevronRight
                className={`transition-transform duration-300 ${
                  showVistas ? "rotate-90" : ""
                }`}
              />
            </>
          ) : (
            <FileText size={24} className="mx-auto" />
          )}
        </button>

        {showVistas &&
          isExpanded &&
          vistasArray.map((item, index) => (
            <motion.div
              key={item.name}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stackVariants}
              transition={{
                duration: 0.1,
                delay: index / 10 
              }}
              className="ml-4 flex flex-col gap-2"
            >
              <Link
                to={`/dashboard/${item.route}`}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  location.pathname === `/dashboard/${item.route}`
                    ? "bg-neutral-800 text-white"
                    : "hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            </motion.div>
          ))}

        <button
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          onClick={handleShowCargar}
        >
          {isExpanded ? (
            <>
              <span className="font-semibold whitespace-nowrap">Cargar</span>
              <ChevronRight
                className={`transition-transform duration-300 ${
                  showCargar ? "rotate-90" : ""
                }`}
              />
            </>
          ) : (
            <FolderPlus size={24} className="mx-auto" />
          )}
        </button>
        {showCargar &&
          isExpanded &&
          cargarArray.map((item, index) => (
            <motion.div
              key={item.name}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={stackVariants}
              transition={{ duration: 0.1, delay: index / 10 }}
              className="ml-4 flex flex-col gap-2"
            >
              <Link
                to={`/dashboard/${item.route}`}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  location.pathname === `/dashboard/${item.route}`
                    ? "bg-neutral-800 text-white"
                    : "hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            </motion.div>
          ))}
      </div>

      <div className="mt-auto  flex flex-col gap-4">
        <button
          onClick={toggleFullscreen}
          className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          title={isFullscreen ? "Minimizar" : "Pantalla completa"}
        >
          <Fullscreen size={20} />
          {isExpanded && (
            <span className="whitespace-nowrap">
              {isFullscreen ? "Minimizar" : "Pantalla completa"}
            </span>
          )}
        </button>

        <button
          onClick={handleLogOut}
          className="flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
          {isExpanded && (
            <span className="whitespace-nowrap">Cerrar sesión</span>
          )}
        </button>
      </div>
    </nav>
  );
}
