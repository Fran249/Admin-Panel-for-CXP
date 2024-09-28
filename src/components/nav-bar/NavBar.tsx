import { Link, useLocation } from "react-router-dom";

import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";


const NavBar = () => {
  const navArray = ["publicaciones", "proyectos", "imagenes", "archivos"];
  const location = useLocation(); // Hook para obtener la ruta actual

  const handleLogOut = () => {
    signOut(auth);
  };

  return (
    <>
      <nav className="font-archivo  w-full h-20 flex justify-center items-center gap-10 bg-neutral-100 ">
        <div className="relative flex justify-center items-center w-full">
          <div className=" p-2 bg-neutral-200 rounded-xl gap-2 flex justify-center items-center ">
            {navArray.map((item,index) => (
              <Link
              key={index}
                to={`${item}`}
                className={`border-[.5px] transition-colors duration-300 px-10 py-1 font-bold text-xl rounded-xl first-letter:uppercase ${
                  location.pathname === `/dashboard/${item}`
                    ? "bg-neutral-900 text-white"
                    : "bg-transparent text-neutral-400"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
          <button onClick={handleLogOut} className="transition-colors duration-300 flex justify-center items-center gap-2 absolute top-2 right-5 hover:bg-neutral-800 text-neutral-900 hover:text-neutral-50 rounded-xl px-5 py-2">
            <LogOut />
            Cerrar sesión
          </button>
        </div>
      </nav>

    </>
  );
};

export default NavBar;
