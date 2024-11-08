// src/pages/Publicaciones.jsx
import { useEffect } from "react";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Plus } from "lucide-react";

import { Table } from "../../components/table/Table";
import { Link } from "react-router-dom";
import { useStorage } from "../../hooks/useStorage";
import { deleteObject, ref } from "firebase/storage";
import { toast, Toaster } from "sonner";
import { storage } from "../../services/firebase";
import { truncateText } from "../../utils/truncateText";
export const Archivos = () => {
  const { filesFromPublications, filesFromServices, Refresh, loading } = useStorage({
    filesFromPublicationsRoute: "publications/files",
    filesFromServicesRoute: "services/files",
  });

  const handleButtonClick = async (item: any) => {
    try {
      const fileRef = ref(storage, item.url);
      await deleteObject(fileRef);
      toast.success(
        `Archivo ${truncateText(item.filename)} eliminado exitosamente!`
      );
    } catch (error) {
      toast.error(`Hubo un error. ${error}`);
    } finally {
      Refresh();
    }
  };
  useEffect(() => {
    console.log(" estas en la ruta de archivos");
    if (filesFromPublications.length > 0) {
      console.log(filesFromPublications);
    }
    if (filesFromServices.length > 0) {
      console.log(filesFromServices);
    }
  }, [filesFromPublications, filesFromServices]);
  return (
    <section className="bg-neutral-100 w-full min-h-screen flex flex-col justify-center items-center py-40 text-black">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : filesFromPublications.length > 0 ? (
        <>
          <Link to={"upload"}>
            <FromDevzButton text="Subir archivo">
              <Plus size={20} />
            </FromDevzButton>
          </Link>

          <div className="w-[90%] h-full p-5">
            <Table
              tableTitle="Archivo"
              files={filesFromPublications}
              handleButtonClick={handleButtonClick}
              documentFormatter={false}
              imageFormatter={false}
              fileFormatter={true}
            />
          </div>
        </>
      ) : (
        <h3 className="text-xl font-bold">No hay archivos</h3>
      )}
      <Toaster />
    </section>
  );
};
