// src/pages/Consultores.jsx
import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";
import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import { db } from "../../services/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast, Toaster } from "sonner";
export const Consultores = () => {
  const { consultores, loading, setLoading, refreshPublications } = useDb({
    dbRoute: "consultores",
  });

  const handleButtonClick = async (pub: any) => {
    setLoading(true);
    const docRef = doc(db, "consultores", pub.id);
    try {
      await deleteDoc(docRef);
      toast.success("Documento borrado con éxito!");
      await refreshPublications();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      toast.error("Error al borrar el documento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(" estas en la ruta de Consultores");
  }, []);
  return (
    <section className=" w-full min-h-screen gap-5 flex justify-center items-center flex-col text-black bg-neutral-100">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <>
          <div className="w-[95%] flex justify-center items-center">
            <Link to={"upload"}>
              <FromDevzButton text="Nuevo Consultor">
                <Plus size={20} />
              </FromDevzButton>
            </Link>
          </div>

          <div className="w-[90%] h-full pl-12">
            <Table
              tableTitle="Consultor"
              items={consultores}
              handleButtonClick={handleButtonClick}
              consultorFormatter={true}
            />
          </div>
        </>
      )}
      <Toaster />
    </section>
  );
};
