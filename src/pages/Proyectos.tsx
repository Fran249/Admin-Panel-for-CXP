// src/pages/Publicaciones.jsx
import { useEffect, useState } from "react";
import { FromDevzButton } from "../components/button/FromDevzButton";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { Table } from "../components/table/Table";
import { Link } from "react-router-dom";
export const Proyectos = () => {
  const publicaciones = [
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
    console.log(" estas en la ruta de proyectos");
  }, []);
  return (
    <section className="bg-neutral-100 w-full h-screen py-20 flex flex-col justify-center items-center text-black">
      <Link to={'upload'}>
        <FromDevzButton click={handleButtonClick} text="Nuevo proyecto">
          <Plus size={20} />
        </FromDevzButton>
      </Link>

      <div className="w-[calc(100%-240px)] h-full p-5">
        <Table
          items={publicaciones}
          handleButtonClick={handleButtonClick}
          imageFormatter={false}
          documentFormatter={true}
          fileFormatter={false}
        />
      </div>
    </section>
  );
};
