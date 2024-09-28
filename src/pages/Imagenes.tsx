// src/pages/Publicaciones.jsx
import { useEffect} from "react";
import { FromDevzButton } from "../components/button/FromDevzButton";
import {Plus, } from "lucide-react";
import image from '../assets/servicio-card.png'
import { Table } from "../components/table/Table";
export const Imagenes = () => {



  const images = [
    { id: 1, name: "Publicación 1", url: image },
    { id: 2, name: "Publicación 2", url: image },
    { id: 3, name: "Publicación 3", url: image },
    { id: 4, name: "Publicación 4", url: image },
    { id: 5, name: "Publicación 5", url: image },
    { id: 6, name: "Publicación 6", url: image },
    { id: 7, name: "Publicación 7", url: image },
    { id: 8, name: "Publicación 8", url: image },
    { id: 9, name: "Publicación 9", url: image },
    { id: 10, name: "Publicación 10", url: image },
  ];




  const handleButtonClick = () => {
    console.log("click");
  };


 

  useEffect(() => {
    console.log(" estas en la ruta de Imagenes");
  }, []);
  return (
    <section className="bg-neutral-100 w-full h-[calc(100dvh-80px)] flex text-black">
      <div className="w-60 flex flex-col justify-start gap-5 py-10 items-center h-full  border-r-[.5px] border-neutral-400">
        <FromDevzButton click={handleButtonClick} text="Cargar imagen">
          <Plus size={20} />
        </FromDevzButton>
      </div>

      <div className="w-[calc(100%-240px)] h-full p-5">
       <Table items={images} handleButtonClick={handleButtonClick} imageFormatter={true} documentFormatter={false} fileFormatter={false}/>
      </div>
    </section>
  );
};
