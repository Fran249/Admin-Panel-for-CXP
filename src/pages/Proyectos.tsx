// src/pages/Publicaciones.jsx


import { useEffect, useState } from "react";
import { AddEditButtons } from "../components/add-edit-buttons/AddEditButtons";

export const Proyectos = () => {
  const [edit, setEdit] = useState(true)
  const [add, setAdd] = useState(false) 

  const handleEdit = () => {
    setAdd(false)
    setEdit(true)
  }
  const handleAdd = () => {
    setEdit(false)
    setAdd(true)
  }

  useEffect(() => {
    console.log(" estas en la ruta de proyectos");
  }, []);
  return (
    <section className="relative w-full h-screen flex justify-center place-items-center text-black">
      {
        edit && <h3>Editar Proyectos</h3>
      }
      {
        add && <h3>Agregar Proyectos</h3>
      }
      
      <AddEditButtons handleAdd={handleAdd} handleEdit={handleEdit}/>
      
    </section>
  );
};


