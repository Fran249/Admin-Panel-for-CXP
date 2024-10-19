import { ref, uploadBytes } from "firebase/storage";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Save } from "lucide-react";
import React, { useState } from "react";
import { storage } from "../../services/firebase";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../../utils/truncateText";

export const NewArchivo = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>("");
  const navigate = useNavigate();

  const handleUploadFiles = async () => {
    setLoading(true);
    try {
      // Mapeamos los archivos seleccionados y subimos cada uno
      for (const archivo of selectedFiles) {
        const storageRef = ref(storage, `${rutaSeleccionada}${archivo.name}`);
        await uploadBytes(storageRef, archivo); // Espera a que se complete la carga
      }
  
      // Mensaje de éxito
      toast.success("Archivos cargados exitosamente! Dirigiendo a la vista de Archivos...");
  
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate("/dashboard/archivos");
      }, 3000);
    } catch (error) {
      // Manejo de errores
      toast.error(`Ha ocurrido un error. ${error}`);
    } finally {
      // Asegura que el estado de loading se cambie
      setLoading(false);
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convertir los archivos a un array
      setSelectedFiles(fileArray);
      setPreviewUrls(fileArray)
    }
  };

  const handleRutaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRutaSeleccionada(e.target.value); // Establecer la ruta seleccionada
  };

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 ";

  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <div className="flex flex-col gap-10">
          {previewUrls.length > 0 && (
            <div className="flex flex-col justify-center items-center gap-5">
              <h3 className="border-[.5px] border-neutral-800 p-2 rounded-lg text-neutral-800 font-archivo font-semibold">
                Vista previa
              </h3>
              <div className="flex justify-center items-center gap-4">
                {(previewUrls.length > 2
                  ? previewUrls.slice(0, 2)
                  : previewUrls
                ).map((previewUrl, index) => (
                  <div
                    key={index}
                    className="w-[300px] h-[300px] rounded-lg border-[.5px] border-neutral-800 flex justify-center items-center relative"
                  >
                    <div className=" flex justify-center items-center w-full rounded-t-lg h-16 absolute top-0 left-0 bg-neutral-800 text-neutral-200">
                      <h3>{truncateText(previewUrl.name)}</h3>
                    </div>
                  </div>
                ))}
                {previewUrls.length > 2 && (
                  <div className="w-[300px] h-[300px] rounded-lg border-[.5px] border-neutral-800 flex justify-center items-center text-xl ">
                    <h3>Y {previewUrls.length - 2} más..</h3>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="flex flex-col justify-center items-start gap-6">
              <h3 className="text-lg font-semibold">Seleccione la ruta</h3>
              <div className="flex justify-start items-center gap-4">
                <div className="flex justify-center items-center gap-2">
                  <input
                    type="checkbox"
                    name="ruta"
                    id="ruta-proyectos"
                    value="/projects/files/"
                    checked={rutaSeleccionada === "/projects/files/"}
                    onChange={handleRutaChange}
                    className={inputClasses}
                  />
                  <label htmlFor="ruta-proyectos" className={labelClasses}>
                    Proyectos
                  </label>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <input
                    type="checkbox"
                    name="ruta"
                    id="ruta-publicaciones"
                    value="/publications/files/"
                    checked={rutaSeleccionada === "/publications/files/"}
                    onChange={handleRutaChange}
                    className={inputClasses}
                  />
                  <label htmlFor="ruta-publicaciones" className={labelClasses}>
                    Publicaciones
                  </label>
                </div>
              </div>
            </div>
          )}

          <input
            className={inputClasses}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />

          {selectedFiles.length > 0 && rutaSeleccionada && (
            <div className="w-full flex justify-center items-center">
              <FromDevzButton text="Cargar archivos" click={handleUploadFiles}>
                <Save />
              </FromDevzButton>
            </div>
          )}
        </div>
      )}
      <Toaster />
    </section>
  );
};
