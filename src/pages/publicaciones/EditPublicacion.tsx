import { useLocation } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import {
  Briefcase,
  Calendar,
  File,
  FileText,
  Image,
  LoaderCircle,
  MapPin,
  Save,
  Tag,
  User,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import { truncateText } from "../../utils/truncateText";

type FormData = {
  titulo_publicacion: string;
  abstract: string;
  archivo: File | null;
  autor_publicacion: string;
  coautores: string[];
  fecha_publicacion: string;
  imagen: File | null;
  industria_asociada: string[];
  keywords: string[];
  lugar_publicacion: string;
  more_authors: boolean;
  servicios_relacionados: string[];
};

export const EditPublicacion = () => {
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const { findedDoc, loading, setLoading } = useDb({
    dbRoute: "publications",
    id: id,
  });

  const [image, setImage] = useState<File[]>([]);
  const [archivo, setArchivo] = useState<File[]>([]);


  const [formData, setFormData] = useState<FormData>({
    titulo_publicacion: "",
    abstract: "",
    archivo: null,
    autor_publicacion: "",
    coautores: Array(5).fill(""),
    fecha_publicacion: "",
    imagen: null,
    industria_asociada: [],
    keywords: Array(5).fill(""),
    lugar_publicacion: "",
    more_authors: false,
    servicios_relacionados: [],
  });
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);

  const servicios = [
    { value: "consultoria", label: "Consultoría" },
    { value: "desarrollo", label: "Desarrollo" },
    { value: "diseño", label: "Diseño" },
  ];

  const industrias = [
    { value: "tecnologia", label: "Tecnología" },
    { value: "construccion", label: "Construcción" },
    { value: "salud", label: "Salud" },
  ];

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";


  useEffect(() => {
    if (findedDoc) {
      setFormData({
        titulo_publicacion: findedDoc.titulo_publicacion,
        abstract: findedDoc.abstract,
        archivo: null,
        autor_publicacion: findedDoc.autor_publicacion,
        coautores: findedDoc.coautores,
        fecha_publicacion: findedDoc.fecha_publicacion,
        imagen: null,
        industria_asociada: findedDoc.industria_asociada,
        keywords: findedDoc.keywords,
        lugar_publicacion: findedDoc.lugar_publicacion,
        more_authors: findedDoc.more_authors,
        servicios_relacionados: findedDoc.servicios_relacionados,
      });
    }
  }, [findedDoc]);

  /*HANDLE IMAGEN*/
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(Array.from(e.target.files));
    }
  };
  /*HANDLE ARCHIVO*/
  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivo(Array.from(e.target.files));
    }
  };
  // /*HANDLE KEYWORDS*/
  // const handleKeywordChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const newKeywords = [...keywords];
  //   newKeywords[index] = e.target.value;
  //   setKeywords(newKeywords);
  // };
  // /*HANDLE COAUTORES*/
  // const handleCoautoresChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const newCoautores = [...coautores];
  //   newCoautores[index] = e.target.value;
  //   setCoautores(newCoautores);
  // };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number // Agrega 'index' opcional para manejar arrays
  ) => {
    const { name, value } = e.target;
  
    if (index !== undefined && name.startsWith("keywords_")) {
      // Si es un cambio en 'keywords', manejamos el array
      setFormData((prev) => {
        const updatedKeywords = [...prev.keywords]; // Clona el array actual de keywords
        updatedKeywords[index] = value; // Actualiza el valor en el índice correspondiente
  
        return { ...prev, keywords: updatedKeywords }; // Devuelve el estado actualizado
      });
    } else {
      // Manejo normal para otros inputs
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange =
    (
      name: keyof Pick<
        FormData,
        "servicios_relacionados" | "industria_asociada"
      >
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item: string) => item !== value),
      }));
    };

  /*GUARDAR CAMBIOS*/
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Subir la imagen si hay una seleccionada
    let imageUrl = findedDoc?.imagen; // Valor por defecto
    if (image.length > 0) {
      const imageRef = ref(storage, `publications/images/${image[0].name}`);
      await uploadBytes(imageRef, image[0]); // Sube la imagen
      imageUrl = await getDownloadURL(imageRef); // Obtiene la URL
    }

    // Subir el archivo si hay uno seleccionado
    let archivoUrl = findedDoc?.archivo; // Valor por defecto
    if (archivo.length > 0) {
      const archivoRef = ref(storage, `publications/files/${archivo[0].name}`);
      await uploadBytes(archivoRef, archivo[0]); // Sube el archivo
      archivoUrl = await getDownloadURL(archivoRef); // Obtiene la URL
    }

    // Actualiza los datos de la publicación
    const newPublicacion = {
      autor_publicacion: formData.autor_publicacion,
      abstract: formData.abstract,
      titulo_publicacion: formData.titulo_publicacion,
      fecha_publicacion: formData.fecha_publicacion,
      servicios_relacionados: formData.servicios_relacionados,
      industria_asociada: formData.industria_asociada,
      lugar_publicacion: formData.lugar_publicacion,
      keywords: formData.keywords,
      imagen: imageUrl, 
      archivo: archivoUrl, 
    };


    const docRef = doc(db, "publications", id); 
    await updateDoc(docRef, newPublicacion);
    setLoading(false);

    console.log("Publicación actualizada:", newPublicacion);
    setTimeout(() => {
      window.location.href = "/dashboard/publicaciones";
    }, 3000);
    toast.success(
      "Documento actualizado con exito! Dirigiendo a la vista de Publicaciones..."
    );
  };

  return (
    <section className="w-full min-h-screen py-20 flex flex-col justify-center items-center text-black bg-neutral-100">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/*TITULO PUBLICACION*/}
            <div className="col-span-2">
              <label htmlFor="titulo_publicacion" className={labelClasses}>
                Título de la publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="titulo_publicacion"
                  id="titulo_publicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder={`Titulo : ${formData.titulo_publicacion}`}
                  defaultValue={formData.titulo_publicacion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            {/*ABSTRACT*/}
            <div className="col-span-2">
              <label htmlFor="abstract" className={labelClasses}>
                Abstract
              </label>
              <textarea
                name="abstract"
                id="abstract"
                rows={5}
                className={inputClasses}
                placeholder="Ingrese el abstract..."
                defaultValue={formData.abstract}
                onChange={(e) => handleInputChange(e)}
              ></textarea>
            </div>
            {/*LUGAR PUBLICACION*/}
            <div>
              <label htmlFor="lugar_publicacion" className={labelClasses}>
                Lugar de publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="lugar_publicacion"
                  id="lugar_publicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ciudad, País"
                  defaultValue={formData.lugar_publicacion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            {/*AUTOR PUBLICACION*/}
            <div>
              <label htmlFor="autor_publicacion" className={labelClasses}>
                Autor de la publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="autor_publicacion"
                  id="autor_publicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder={`Autor: ${formData.autor_publicacion}`}
                  defaultValue={formData.autor_publicacion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            {/*FECHA PUBLICACION*/}
            <div>
              <label htmlFor="fecha_publicacion" className={labelClasses}>
                Fecha de publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="date"
                  name="fecha_publicacion"
                  id="fecha_publicacion"
                  className={`${inputClasses} pl-10`}
                  defaultValue={formData.fecha_publicacion}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            {/*COAUTORES*/}
            {formData.coautores.map((coautor, index) => (
              <div key={index}>
                <label htmlFor={`coautor_${coautor}`} className={labelClasses}>
                  Coautor {index + 1}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name={`coautor_${coautor}`}
                    id={`coautor_${coautor}`}
                    className={`${inputClasses} pl-10`}
                    placeholder={`Coautor_${index + 1}: ${coautor}`}
                    defaultValue={coautor}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
              </div>
            ))}
            {/*KEYWORDS*/}
            <div className="col-span-2">
              <label htmlFor="keywords" className={labelClasses}>
                Keywords
              </label>
              <div className="grid grid-cols-2 gap-4">
                {formData.keywords.map((keyword, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name={`keywords_${index}`} // Actualiza el 'name' sin el formato [index - 1]
                      id={`keywords_${index}`}
                      className={inputClasses}
                      placeholder={`Keyword_${index + 1}`}
                      value={keyword} // Usa 'value' en lugar de 'defaultValue' para inputs controlados
                      onChange={(e) => handleInputChange(e, index)} // Pasa el índice al manejar el cambio
                    />
                  </div>
                ))}
              </div>
            </div>
            {/*SERVICIOS RELACIONADOS*/}
            <div>
              <label htmlFor="servicios_relacionados" className={labelClasses}>
                Servicios relacionados
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-neutral-500" />
                </div>
                <div
                  className={`${inputClasses} pl-10 cursor-pointer`}
                  onClick={() => setIsServiciosOpen(!isServiciosOpen)}
                >
                  {formData.servicios_relacionados.length > 0
                    ? formData?.servicios_relacionados
                        .map(
                          (service) =>
                            servicios.find((s) => s.value === service)?.label
                        )
                        .join(", ")
                    : "Seleccione un servicio"}
                </div>
                {isServiciosOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-neutral-200 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {servicios.map((servicio) => (
                      <div
                        key={servicio.value}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          id={servicio.value}
                          name="servicios_relacionados"
                          value={servicio.value}
                          checked={formData.servicios_relacionados.includes(
                            servicio.value
                          )}
                          onChange={handleCheckboxChange(
                            "servicios_relacionados"
                          )}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={servicio.value}
                          className="ml-3 block text-sm text-gray-700"
                        >
                          {servicio.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/*INDUSTRIA ASOCIADA*/}
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
                            industrias.find((i) => i.value === industry)?.label
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
                          onChange={handleCheckboxChange("industria_asociada")}
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
            {/*ARCHIVO*/}
            <div>
              <label htmlFor="archivo" className={labelClasses}>
                Archivo
              </label>
              <div className="my-4">
                <h3 className="font-bold">Archivo previo</h3>
                <div className="w-40 h-32 relative rounded-lg shadow-sm shadow-neutral-700">
                  <div className="p-2 rounded-t-lg w-full h-10 absolute top-0 right-0 bg-red-800 flex justify-center items-center">
                    <h3 className="text-sm text-white">
                      {(() => {
                        if (findedDoc?.archivo) {
                          // Obtener la parte antes de '?'
                          const fileUrlWithoutParams =
                            findedDoc.archivo.split("?")[0]; // Divide la URL por '?' para eliminar los parámetros

                          // Obtener la parte después de 'o/' en la URL
                          const filePath = fileUrlWithoutParams.split("o/")[1]; // Divide la URL por 'o/' y toma la segunda parte

                          if (filePath) {
                            // Decodificar y reemplazar %20 con espacios
                            const decodedFileName = decodeURIComponent(
                              filePath.replace(/%20/g, " ")
                            );

                            // Retornar solo el nombre del archivo
                            const fileName = decodedFileName.substring(
                              decodedFileName.lastIndexOf("/") + 1
                            );
                            const filenameTruncated = truncateText({
                              text: fileName,
                            });
                            return filenameTruncated;
                          }
                        }
                        return "No hay archivo disponible"; // Mensaje si no hay archivo
                      })()}
                    </h3>
                    <File className="text-white" />
                  </div>
                </div>
              </div>

              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-neutral-200">
                  <File className="h-full w-full text-neutral-500 p-2" />
                </span>
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  accept=".pdf"
                  className="ml-5 bg-neutral-200 py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                  onChange={(e) => handleArchivo(e)}
                />
              </div>
            </div>
            {/*IMAGEN*/}
            <div>
              <label htmlFor="imagen" className={labelClasses}>
                Imagen
              </label>
              {findedDoc?.imagen && (
                <div className="my-4">
                  <h3 className="font-bold">Imagen previa</h3>
                  <img
                    className="w-40 h-32 rounded-lg shadow-sm shadow-neutral-800"
                    src={findedDoc?.imagen}
                    alt=""
                  />
                </div>
              )}
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-neutral-200">
                  <Image className="h-full w-full text-neutral-500 p-2" />
                </span>
                <input
                  type="file"
                  name="imagen"
                  id="imagen"
                  accept="image/*"
                  className="ml-5 bg-neutral-200 py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                  onChange={(e) => handleImagen(e)}
                />
              </div>
            </div>

            <FromDevzButton text="Guardar cambios" submitType={true}>
              <Save />
            </FromDevzButton>
          </div>
        </form>
      )}
      <Toaster />
    </section>
  );
};
