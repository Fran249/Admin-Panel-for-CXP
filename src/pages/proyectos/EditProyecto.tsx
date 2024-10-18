import React, { useEffect } from "react";
import { db, storage } from "../../services/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  FileText,
  Image,
  LoaderCircle,
  Save,
  Tag,
  Trash,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import { Tooltip } from "@mui/material";

interface FormData {
  imagenes: File[] | string[];
  nombre_proyecto: string;
  texto_1: string;
  texto_2: string;
  tipo_de_recurso: string;
  industria_asociada: string[];
  ubicacion_localidad: string;
  ubicacion_pais: string;
  longitude: number | string;
  latitude: number | string;
}

export const EditProyecto = () => {
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const { findedDocProjects, loading, setLoading } = useDb({
    dbRoute: "projects",
    id: id,
  });
  const navigate = useNavigate();
  const [image, setImage] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageId, setImageId] = useState<string>("");
  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    imagenes: [],
    nombre_proyecto: "",
    texto_1: "",
    texto_2: "",
    tipo_de_recurso: "",
    industria_asociada: [],
    ubicacion_localidad: "",
    ubicacion_pais: "",
    longitude: "",
    latitude: "",
  });
  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";

  useEffect(() => {
    if (findedDocProjects) {
      setFormData({
        imagenes: [],
        nombre_proyecto: findedDocProjects.nombre_proyecto,
        texto_1: findedDocProjects.texto_1,
        texto_2: findedDocProjects.texto_2,
        tipo_de_recurso: findedDocProjects.tipo_de_recurso,
        industria_asociada: findedDocProjects.industria_asociada,
        ubicacion_localidad: findedDocProjects.ubicacion_localidad,
        ubicacion_pais: findedDocProjects.ubicacion_pais,
        longitude: findedDocProjects.longitude,
        latitude: findedDocProjects.latitude,
      });
    }
    if (findedDocProjects && findedDocProjects?.imagenes.length > 0) {
      setHasImage(!hasImage);
      setImages(findedDocProjects?.imagenes);
    }
  }, [findedDocProjects]);

  const handleHasImage = () => {
    setHasImage(!hasImage);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange =
    (name: keyof Pick<FormData, "industria_asociada">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item: string) => item !== value),
      }));
    };

  //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, files } = e.target;
  //     if (files) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: Array.isArray(prev[name as keyof typeof prev]) // Verificar que es un array
  //           ? [
  //               ...(prev[name as keyof typeof prev] as File[]),
  //               ...Array.from(files),
  //             ] // Si es un array, propagar
  //           : Array.from(files), // Si no es un array, inicializar con los nuevos archivos
  //       }));
  //     }
  //     console.log(files, name);
  //   };
  const handleDeleteImgFromDoc = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    toast.success(
      "Imagen eliminada del documento, no olvide guardar cambios para que surga efecto!"
    );
  };
//   const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setImage(Array.from(e.target.files));
//     }
//     console.log(e.target.files);
//   };
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
        console.log(filesArray)
      setImage(filesArray); // Guardar todas las imágenes seleccionadas en el estado
    }
  };

  /*GUARDAR CAMBIOS*/
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    let imageUrls = images ? [...images] : []; // Mantener las URLs existentes

    if (hasImage && image.length > 0) {
      try {
        // Promesas para subir todas las nuevas imágenes
        const uploadPromises = image.map(async (imagen: File) => {
          const storageRef = ref(storage, `projects/images/${imagen.name}`);
          await uploadBytes(storageRef, imagen); // Subir cada imagen
          return getDownloadURL(storageRef); // Obtener URL de la imagen subida
        });
    
        // Esperar a que se completen todas las subidas y obtener nuevas URLs
        const newImageUrls = await Promise.all(uploadPromises);
    
        // Combinar las nuevas URLs con las existentes
        imageUrls = [...imageUrls, ...newImageUrls];
    
        console.log('URLs de imágenes finalizadas:', imageUrls);
      } catch (error) {
        console.error('Error al subir las imágenes:', error);
      }
    }
    

    const newProject = {
      imagenes: imageUrls,
      nombre_proyecto: formData.nombre_proyecto,
      texto_1: formData.texto_1,
      texto_2: formData.texto_2,
      tipo_de_recurso: formData.tipo_de_recurso,
      industria_asociada: formData.industria_asociada,
      ubicacion_localidad: formData.ubicacion_localidad,
      ubicacion_pais: formData.ubicacion_pais,
      longitude: formData.longitude,
      latitude: formData.latitude,
    };

    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, newProject);
    setLoading(false);

    console.log("Proyecto actualizado:", newProject);
    setTimeout(() => {
      navigate("/dashboard/proyectos");
    }, 3000);
    toast.success(
      "Documento actualizado con exito! Dirigiendo a la vista de Proyectos..."
    );
  };

  const industrias = [
    { value: "hidrocarburos", label: "Hidrocarburos" },
    { value: "mineria", label: "Minería" },
    { value: "renovables", label: "Renovables" },
  ];

  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-5"
        >
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/*Nombre del proyecto*/}
              <div className="col-span-2">
                <label htmlFor="nombre_proyecto" className={labelClasses}>
                  Nombre del proyecto
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name="nombre_proyecto"
                    id="nombre_proyecto"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese el nombre"
                    defaultValue={formData.nombre_proyecto}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*Texto 1 */}
              <div>
                <label htmlFor="texto_1" className={labelClasses}>
                  Texto 1
                </label>
                <textarea
                  name="texto_1"
                  id="texto_1"
                  rows={5}
                  className={inputClasses}
                  placeholder="Ingrese el texto 1..."
                  defaultValue={formData.texto_1}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              {/*Texto 2 */}
              <div>
                <label htmlFor="texto_2" className={labelClasses}>
                  Texto 2
                </label>
                <textarea
                  name="texto_2"
                  id="texto_2"
                  rows={5}
                  className={inputClasses}
                  placeholder="Ingrese el texto 2..."
                  defaultValue={formData.texto_2}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              {/*Tipo de recurso */}
              <div>
                <label htmlFor="tipo_de_recurso" className={labelClasses}>
                  Tipo de recurso
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name="tipo_de_recurso"
                    id="tipo_de_recurso"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese el tipo de recurso"
                    defaultValue={formData.tipo_de_recurso}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*Industria Asociada*/}
              <div>
                <label htmlFor="industria_asociada" className={labelClasses}>
                  Industria asociada
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div
                    className={`${inputClasses} pl-10 cursor-pointer`}
                    onClick={() => setIsIndustriaOpen(!isIndustriaOpen)}
                  >
                    {formData.industria_asociada.length > 0
                      ? formData.industria_asociada
                          .map(
                            (industry) =>
                              industrias.find((i) => i.value === industry)
                                ?.label
                          )
                          .join(", ")
                      : "Seleccione una industria"}
                  </div>
                  {isIndustriaOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-neutral-200 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {industrias.map((industria) => (
                        <div
                          key={industria.value}
                          className="flex items-center px-4 py-2 hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            id={industria.value}
                            name="industria_asociada"
                            value={industria.value}
                            checked={formData.industria_asociada.includes(
                              industria.value
                            )}
                            onChange={handleCheckboxChange(
                              "industria_asociada"
                            )}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={industria.value}
                            className="ml-3 block text-sm text-gray-700"
                          >
                            {industria.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/*Tiene imagen ?*/}
              <div className="col-span-2 flex justify-center items-center gap-2">
                <label>Imagenes</label>
                <input
                  placeholder="Imagen"
                  type="checkbox"
                  checked={hasImage}
                  onChange={handleHasImage}
                />
              </div>
              {/*Imagenes*/}
              {hasImage && (
                <>
                  {images.length > 0 && (
                    <div>
                      <h3>Imagenes Previas</h3>
                      <div className="flex gap-2">
                        {images.map((url, index) => (
                          <div
                            key={index}
                            className="w-40 h-32 relative"
                            onMouseEnter={() => setImageId(url)}
                            onMouseLeave={() => setImageId("")}
                          >
                            <img
                              key={index}
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className="w-40 h-32 rounded-lg shadow-sm shadow-neutral-700"
                            />
                            {imageId === url && (
                              <div className="flex justify-center items-center text-neutral-200 w-full h-full bg-[#000000a9] absolute top-0 right-0 rounded-lg">
                                <Tooltip title="Eliminar imagen del documento">
                                  <button
                                    onClick={() =>
                                      handleDeleteImgFromDoc(index)
                                    }
                                  >
                                    <Trash />
                                  </button>
                                </Tooltip>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-2 flex justify-center items-center"
                  >
                    <div className="">
                      <label htmlFor="imagenes" className={labelClasses}>
                        Imagenes Nuevas
                      </label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-neutral-200 p-2">
                          <Image className="h-full w-full text-neutral-500" />
                        </span>
                        <input
                          type="file"
                          multiple
                          name="imagenes"
                          id="imagenes"
                          accept="image/*"
                          className="ml-5 bg-neutral-200 py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                          onChange={handleImagen}
                        />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
              {/*Ubicacion Localidad*/}
              <div className="">
                <label htmlFor="ubicacion_localidad" className={labelClasses}>
                  Ubicacion Localidad
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name="ubicacion_localidad"
                    id="ubicacion_localidad"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese la ubicacion"
                    value={formData.ubicacion_localidad}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*Ubicacion Pais*/}
              <div className="">
                <label htmlFor="ubicacion_pais" className={labelClasses}>
                  Ubicacion País
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name="ubicacion_pais"
                    id="ubicacion_pais"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese la ubicacion"
                    value={formData.ubicacion_pais}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*Latitud*/}
              <div className="">
                <label htmlFor="latitude" className={labelClasses}>
                  Latitud
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="number"
                    name="latitude"
                    id="latitude"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese la latitud"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*Longitud*/}
              <div className="">
                <label htmlFor="longitude" className={labelClasses}>
                  Longitud
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="number"
                    name="longitude"
                    id="longitude"
                    className={`${inputClasses} pl-10`}
                    placeholder="Ingrese la longitud"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-full justify-center items-center flex">
              <FromDevzButton text="Guardar cambios" submitType={true}>
                <Save />
              </FromDevzButton>
            </div>
          </form>
        </motion.div>
      )}
      <Toaster />
    </section>
  );
};
