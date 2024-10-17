import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";
import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import { Toaster, toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

export const Publicaciones = () => {
  const { publicaciones, loading, setLoading, refreshPublications } = useDb({ dbRoute: "publications" });

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
    console.log("Estás en la ruta de publicaciones");
  }, []);

  return (
    <section className="w-full min-h-screen py-20 flex flex-col justify-center items-center text-black bg-neutral-100">
      {loading ? (
        <LoaderCircle className="text-neutral-900 animate-spin" />
      ) : (
        <>
          <Link to={"upload"}>
            <FromDevzButton text="Nueva publicacion">
              <Plus size={20} />
            </FromDevzButton>
          </Link>

          <div className="w-full h-full p-5">
            <Table
            tableTitle="Publicación"
              items={publicaciones}
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
