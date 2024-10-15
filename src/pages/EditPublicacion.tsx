import { useLocation } from "react-router-dom";
import { useDb } from "../hooks/useDb";
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
import { FromDevzButton } from "../components/button/FromDevzButton";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../services/firebase";
import { truncateText } from "../utils/truncateText";

export const EditPublicacion = () => {
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const { findedDoc, loading, setLoading } = useDb({
    dbRoute: "publications",
    id: id,
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [coautores, setCoautores] = useState<string[]>([]);
  const [autor, setAutor] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [tituloPublicacion, setTituloPublicacion] = useState<string>("");
  const [fechaPublicacion, setFechaPublicacion] = useState<string>("");
  const [serviciosRelacionados, setServiciosRelacionados] =
    useState<string>("");
  const [industriaAsociada, setIndustriaAsociada] = useState<string>("");
  const [lugarPublicacion, setLugarPublicacion] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);
  const [archivo, setArchivo] = useState<File[]>([]);

  useEffect(() => {
    if (findedDoc) {
      setKeywords(findedDoc.keywords || []);
      setCoautores(findedDoc.coautores || []);
      setAutor(findedDoc.autor_publicacion || "");
      setAbstract(findedDoc.abstract || "");
      setTituloPublicacion(findedDoc.titulo_publicacion || "");
      setFechaPublicacion(findedDoc.fecha_publicacion || "");
      setServiciosRelacionados(findedDoc.servicios_relacionados || "");
      setIndustriaAsociada(findedDoc.industria_asociada || "");
      setLugarPublicacion(findedDoc.lugar_publicacion || "");
    }
  }, [findedDoc]);

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";

  /*HANDLE AUTOR*/
  const handleAutorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAutor(inputValue);
  };
  /*HANDLE ABSTRACT*/
  const handleAbstractChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setAbstract(inputValue);
  };
  /*HANDLE TITULO PUBLICACION*/
  const handleTituloPublicacionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    setTituloPublicacion(inputValue);
  };
  /*HANDLE FECHA PUBLICACION*/
  const handleFechaPublicacionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    setFechaPublicacion(inputValue);
  };
  /*HANDLE SERVICIOS RELACIONADOS*/
  const handleServiciosRelacionados = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const inputValue = e.target.value;
    setServiciosRelacionados(inputValue);
  };
  /*HANDLE INDUSTRIA ASOCIADA*/
  const handleIndustriaAsociada = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputValue = e.target.value;
    setIndustriaAsociada(inputValue);
  };
  /*HANDLE LUGAR PUBLICACION*/
  const handleLugarPublicacion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setLugarPublicacion(inputValue);
  };
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
  /*HANDLE KEYWORDS*/
  const handleKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newKeywords = [...keywords];
    newKeywords[index] = e.target.value;
    setKeywords(newKeywords);
  };
  /*HANDLE COAUTORES*/
  const handleCoautoresChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newCoautores = [...coautores];
    newCoautores[index] = e.target.value;
    setCoautores(newCoautores);
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
      autor_publicacion: autor,
      abstract: abstract,
      titulo_publicacion: tituloPublicacion,
      fecha_publicacion: fechaPublicacion,
      servicios_relacionados: serviciosRelacionados,
      industria_asociada: industriaAsociada,
      lugar_publicacion: lugarPublicacion,
      keywords: keywords,
      imagen: imageUrl, // Asigna la URL de la imagen
      archivo: archivoUrl, // Asigna la URL del archivo
    };

    // Asegúrate de que estás usando `db` en lugar de `firestore`
    const docRef = doc(db, "publications", id); // Aquí usa `db` si es la instancia correcta
    await updateDoc(docRef, newPublicacion);
    setLoading(false);

    console.log("Publicación actualizada:", newPublicacion);
    setTimeout(() => {
      window.location.href = "/dashboard/publicaciones";
    }, 3000)
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
                  placeholder={`Titulo : ${findedDoc?.titulo_publicacion}`}
                  defaultValue={findedDoc?.titulo_publicacion}
                  onChange={(e) => handleTituloPublicacionChange(e)}
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
                defaultValue={findedDoc?.abstract}
                onChange={(e) => handleAbstractChange(e)}
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
                  defaultValue={findedDoc?.lugar_publicacion}
                  onChange={(e) => handleLugarPublicacion(e)}
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
                  placeholder={`Autor: ${findedDoc?.autor_publicacion}`}
                  defaultValue={findedDoc?.autor_publicacion}
                  onChange={(e) => handleAutorChange(e)}
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
                  defaultValue={findedDoc?.fecha_publicacion}
                  onChange={(e) => handleFechaPublicacionChange(e)}
                />
              </div>
            </div>
            {/*COAUTORES*/}
            {findedDoc?.coautores.map((coautor, index) => (
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
                    onChange={(e) => handleCoautoresChange(e, index)}
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
                {findedDoc?.keywords.map((keyword, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name={`keywords[${index - 1}]`}
                      id={`keywords_${keyword}`}
                      className={inputClasses}
                      placeholder={`Keyword_${index + 1}: ${keyword}`}
                      defaultValue={keyword}
                      onChange={(e) => handleKeywordChange(e, index)}
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
                <select
                  name="servicios_relacionados"
                  id="servicios_relacionados"
                  className={`${inputClasses} pl-10`}
                  defaultValue={findedDoc?.servicios_relacionados}
                  onChange={(e) => handleServiciosRelacionados(e)}
                >
                  <option value="">
                    {findedDoc?.servicios_relacionados != ""
                      ? findedDoc?.servicios_relacionados
                      : "No hay servicios seleccionados"}
                  </option>
                  <option value="consultoria">Consultoría</option>
                  <option value="desarrollo">Desarrollo</option>
                  <option value="diseño">Diseño</option>
                </select>
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
                <select
                  name="industria_asociada"
                  id="industria_asociada"
                  className={`${inputClasses} pl-10`}
                  defaultValue={findedDoc?.industria_asociada}
                  onChange={(e) => handleIndustriaAsociada(e)}
                >
                  <option value="">
                    {findedDoc?.industria_asociada != ""
                      ? findedDoc?.industria_asociada
                      : "No hay industrias seleccionadas"}
                  </option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="construccion">Construcción</option>
                  <option value="salud">Salud</option>
                </select>
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
                  <File className="h-full w-full text-neutral-500" />
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
                  <Image className="h-full w-full text-neutral-500" />
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
      <Toaster/>
    </section>
  );
};
