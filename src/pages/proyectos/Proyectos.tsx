// src/pages/Publicaciones.jsx
import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";

import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import { deleteDoc, doc } from "firebase/firestore";
import { toast, Toaster } from "sonner";
import { db } from "../../services/firebase";


export const Proyectos = () => {
  const { projects, loading , setLoading, refreshPublications} = useDb({ dbRoute: "projects" });
  const handleButtonClick = async (pub: any) => {
    console.log("Documento a eliminar:", pub);
    setLoading(true);

    const docRef = doc(db, "publications", pub.id);
    try {
      await deleteDoc(docRef);
      toast.success("Documento borrado con éxito!");
      await refreshPublications(); // Actualiza las publicaciones
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      toast.error("Error al borrar el documento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(" estas en la ruta de proyectos");
  }, []);
  return (
    <section className="bg-neutral-100 w-full h-screen py-20 flex flex-col justify-center items-center text-black">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <>
          <Link to={"upload"}>
            <FromDevzButton  text="Nuevo proyecto">
              <Plus size={20} />
            </FromDevzButton>
          </Link>

          <div className="w-[calc(100%-240px)] h-full p-5">
            <Table
              tableTitle="Proyecto"
              items={projects}
              handleButtonClick={handleButtonClick}
              imageFormatter={false}
              documentFormatter={true}
              fileFormatter={false}
            />
          </div>
        </>
      )}
      <Toaster />
    </section>
  );
};
