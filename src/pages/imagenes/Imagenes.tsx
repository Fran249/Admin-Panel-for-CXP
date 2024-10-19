// src/pages/Publicaciones.jsx
import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";
import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useStorage } from "../../hooks/useStorage";
import { storage } from "../../services/firebase";
import { deleteObject, ref } from "firebase/storage";
import { toast, Toaster } from "sonner";
export const Imagenes = () => {
  const { loading, imagesFromPublications, imagesFromProjects, Refresh } =
    useStorage({
      projectsRoute: "/projects/images",
      publicationsRoute: "/publications/images",
    });

  const handleButtonClick = async (item: string) => {
    try {
      const fileRef = ref(storage, item);
      await deleteObject(fileRef);
      toast.success("Imagen eliminada exitosamente!");
    } catch (error) {
      toast.error(`Hubo un error. ${error}`);
    } finally {
      Refresh();
    }
  };

  useEffect(() => {
    console.log(" estas en la ruta de Imagenes");
  }, []);
  return (
    <section className="bg-neutral-100 w-full min-h-screen py-20 flex flex-col justify-center items-center text-black">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <>
          <Link to={"upload"}>
            <FromDevzButton text="Cargar imagen">
              <Plus size={20} />
            </FromDevzButton>
          </Link>

          <div className="w-[calc(100%-240px)] h-full p-5">
            <Table
              tableTitle="Imagenes"
              items1={imagesFromPublications}
              items2={imagesFromProjects}
              handleButtonClick={handleButtonClick}
              imageFormatter={true}
              documentFormatter={false}
              fileFormatter={false}
            />
          </div>
        </>
      )}
      <Toaster />
    </section>
  );
};
