import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";

import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import { deleteDoc, doc } from "firebase/firestore";
import { toast, Toaster } from "sonner";
import { db } from "../../services/firebase";

export const Servicios = () => {
    const { services, loading , setLoading, refreshPublications} = useDb({ dbRoute: "services" });
    const handleButtonClick = async (pub: any) => {
      console.log("Documento a eliminar:", pub);
      setLoading(true);
      console.log("Eliminando documento:", pub.id);
      const docRef = doc(db, "services", pub.id);
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
        console.log(" estas en la ruta de servicios");
      }, []);
  return (
    <section className="bg-neutral-100 w-full h-screen py-40 flex flex-col justify-center items-center text-black">
    {loading ? (
      <LoaderCircle className="text-neutral-800 animate-spin  absolute top-1/2 left-1/2" />
    ) : (
      <>
        <Link to={"upload"}>
          <FromDevzButton  text="Nuevo servicio">
            <Plus size={20} />
          </FromDevzButton>
        </Link>

        <div className="w-[calc(100%-240px)] h-full p-5">
          <Table
            tableTitle="Servicio"
            items={services}
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
  )
}