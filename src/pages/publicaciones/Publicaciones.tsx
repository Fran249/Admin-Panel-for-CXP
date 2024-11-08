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
  const { publicaciones, loading, setLoading, refreshPublications } = useDb({
    dbRoute: "publications",
  });

  const handleButtonClick = async (pub: any) => {
    setLoading(true);
    const docRef = doc(db, "publications", pub.id);
    try {
      await deleteDoc(docRef);
      toast.success("Documento borrado con éxito!");
      await refreshPublications();
    } catch (error) {
      toast.error("Error al borrar el documento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Estás en la ruta de publicaciones");
  }, []);

  return (
    <section className="w-full min-h-screen py-40 flex flex-col justify-center items-end text-black bg-neutral-100">
      {loading ? (
      
          <LoaderCircle className="text-neutral-900 animate-spin absolute top-1/2 left-1/2" />
        
      ) : (
        <>
          <div className="w-[95%] flex justify-center items-center">
            <Link to={"upload"}>
              <FromDevzButton text="Nueva publicacion">
                <Plus size={20} />
              </FromDevzButton>
            </Link>
          </div>
          <div className="w-[95%] h-full p-5">
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
