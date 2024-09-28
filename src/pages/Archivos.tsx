// src/pages/Publicaciones.jsx
import { useEffect} from "react";
import { FromDevzButton } from "../components/button/FromDevzButton";
import {Plus, } from "lucide-react";

import { Table } from "../components/table/Table";
export const Archivos = () => {



  const files = [
    { id: 1, nombre: "Publicación 1", fecha: "2024-09-25" },
    { id: 2, nombre: "Publicación 2", fecha: "2024-09-26" },
    { id: 3, nombre: "Publicación 3", fecha: "2024-09-27" },
    { id: 4, nombre: "Publicación 4", fecha: "2024-09-28" },
    { id: 5, nombre: "Publicación 5", fecha: "2024-09-29" },
    { id: 6, nombre: "Publicación 6", fecha: "2024-09-30" },
    { id: 7, nombre: "Publicación 7", fecha: "2024-10-01" },
    { id: 8, nombre: "Publicación 8", fecha: "2024-10-02" },
    { id: 9, nombre: "Publicación 9", fecha: "2024-10-03" },
    { id: 10, nombre: "Publicación 10", fecha: "2024-10-04" },
  ];




  const handleButtonClick = () => {
    console.log("click");
  };


 

  useEffect(() => {
    console.log(" estas en la ruta de archivos");
  }, []);
  return (
    <section className="bg-neutral-100 w-full h-[calc(100dvh-80px)] flex text-black">
      <div className="w-60 flex flex-col justify-start gap-5 py-10 items-center h-full  border-r-[.5px] border-neutral-400">
        <FromDevzButton click={handleButtonClick} text="Subir archivo">
          <Plus size={20} />
        </FromDevzButton>
      </div>

      <div className="w-[calc(100%-240px)] h-full p-5">
       <Table items={files} handleButtonClick={handleButtonClick} documentFormatter={false} imageFormatter={false} fileFormatter={true}/>
      </div>
    </section>
  );
};
