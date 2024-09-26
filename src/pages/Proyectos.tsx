// src/pages/Proyectos.jsx

import { useEffect } from "react";


export const Proyectos = () => {
  useEffect(() => {
    console.log(' estas en la ruta de proyecto')
  },[])
  return (
    <section className="w-full h-screen flex justify-center place-items-center text-black">
        PROYECTOS
    </section>
  );
};

