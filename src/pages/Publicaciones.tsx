// src/pages/Publicaciones.jsx

import { useEffect } from "react";

export const Publicaciones = () => {
  useEffect(() => {
    console.log(' estas en la ruta de publicaciones')
  },[])
  return (
    <section className="w-full h-screen flex justify-center place-items-center text-black">
      PUBLICACIONES
    </section>
  );
};


