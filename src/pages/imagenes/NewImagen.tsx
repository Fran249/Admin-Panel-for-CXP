import { ref, uploadBytes } from "firebase/storage";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { LoaderCircle, Save } from "lucide-react";
import React, { useState } from "react";
import { storage } from "../../services/firebase";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

export const NewImagen = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>("");
  const navigate = useNavigate();

  const handleUploadImages = async () => {
    setLoading(true);
    try {
      const uploadPromises = selectedImages.map((imagen: File) => {
        const storageRef = ref(storage, `${rutaSeleccionada}${imagen.name}`);
        return uploadBytes(storageRef, imagen);
      });

      // Esperar a que todas las imágenes se suban
      await Promise.all(uploadPromises);

      toast.success(
        "Imagenes cargadas exitosamente! dirigiendo a la vista de Imagenes..."
      );

      setTimeout(() => {
        navigate("/dashboard/imagenes");
      }, 3000);
    } catch (error) {
      toast.error(`Ha ocurrido un error. ${error}`);
    } finally {
      setLoading(false); // Asegurar que el estado de loading se cambie incluso si hay un error
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convertir los archivos a un array
      setSelectedImages(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file)); // Crear URLs de vista previa
      setPreviewUrls(previews);
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
                  <img
                    key={index}
                    src={previewUrl}
                    alt={`Vista previa ${index + 1}`}
                    className="w-[300px] h-[300px] object-cover"
                  />
                ))}
                {previewUrls.length > 2 && (
                  <div className="w-[300px] h-[300px] rounded-lg border-[.5px] border-neutral-800 flex justify-center items-center text-xl ">
                    <h3>Y {previewUrls.length - 2} más..</h3>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedImages.length > 0 && (
            <div className="flex flex-col justify-center items-start gap-6">
              <h3 className="text-lg font-semibold">Seleccione la ruta</h3>
              <div className="flex justify-start items-center gap-4">
                <div className="flex justify-center items-center gap-2">
                  <input
                    type="checkbox"
                    name="ruta"
                    id="ruta-proyectos"
                    value="projects/images/"
                    checked={rutaSeleccionada === "projects/images/"}
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
                    value="publications/images/"
                    checked={rutaSeleccionada === "publications/images/"}
                    onChange={handleRutaChange}
                    className={inputClasses}
                  />
                  <label htmlFor="ruta-consultores" className={labelClasses}>
                    Publicaciones
                  </label>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <input
                    type="checkbox"
                    name="ruta"
                    id="ruta-consultores"
                    value="consultores/images/"
                    checked={rutaSeleccionada === "consultores/images/"}
                    onChange={handleRutaChange}
                    className={inputClasses}
                  />
                  <label htmlFor="ruta-consultores" className={labelClasses}>
                    Consultores
                  </label>
                </div>
              </div>
            </div>
          )}

          <input
            className={inputClasses}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          {selectedImages.length > 0 && rutaSeleccionada && (
            <div className="w-full flex justify-center items-center">
              <FromDevzButton text="Cargar imágenes" click={handleUploadImages}>
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
