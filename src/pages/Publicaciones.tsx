// src/pages/Publicaciones.jsx
import { useEffect } from "react";
import { FromDevzButton } from "../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";
import { Table } from "../components/table/Table";
import { Link } from "react-router-dom";
import { useDb } from "../hooks/useDb";

export const Publicaciones = () => {
  const { publicaciones, loading } = useDb({ dbRoute: "publications" });
  // const publicaciones = [
  //   { id: 1, nombre: "Publicación 1", fecha: "2024-09-25" },
  //   { id: 2, nombre: "Publicación 2", fecha: "2024-09-26" },
  //   { id: 3, nombre: "Publicación 3", fecha: "2024-09-27" },
  //   { id: 4, nombre: "Publicación 4", fecha: "2024-09-28" },
  //   { id: 5, nombre: "Publicación 5", fecha: "2024-09-29" },
  //   { id: 6, nombre: "Publicación 6", fecha: "2024-09-30" },
  //   { id: 7, nombre: "Publicación 7", fecha: "2024-10-01" },
  //   { id: 8, nombre: "Publicación 8", fecha: "2024-10-02" },
  //   { id: 9, nombre: "Publicación 9", fecha: "2024-10-03" },
  //   { id: 10, nombre: "Publicación 10", fecha: "2024-10-04" },
  // ];

  const handleButtonClick = () => {
    console.log("click");
  };

  useEffect(() => {
    console.log(" estas en la ruta de publicaciones");
  }, []);
  return (
    <section className="w-full min-h-screen py-20 flex flex-col justify-center items-center text-black bg-neutral-100">
      {loading ? (
        <LoaderCircle className="text-neutral-900 animate-spin" />
      ) : (
        <>
          <Link to={"upload"}>
            <FromDevzButton click={handleButtonClick} text="Nueva publicacion">
              <Plus size={20} />
            </FromDevzButton>
          </Link>

          <div className="w-full h-full p-5">
            <Table
              items={publicaciones}
              handleButtonClick={handleButtonClick}
              imageFormatter={false}
              documentFormatter={true}
              fileFormatter={false}
            />
          </div>
        </>
      )}
    </section>
  );
};
