import { useLocation, useNavigate } from "react-router-dom";
import { useDb } from "../../hooks/useDb";
import {
  BoxSelect,
  Briefcase,
  Calendar,
  Check,
  File,
  FileText,
  Image,
  LoaderCircle,
  MapPin,
  Save,
  Tag,
  User,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../../components/button/FromDevzButton";
import React, { useEffect, useState } from "react";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { truncateText } from "../../utils/truncateText";
import { Dialog, Tooltip } from "@mui/material";
import { useStorage } from "../../hooks/useStorage";

type FormData = {
  titulo_publicacion: string;
  abstract: string;
  archivo: string;
  autor_publicacion: string;
  coautores: string[];
  fecha_publicacion: string;
  imagenes: string[];
  industria_asociada: string[];
  keywords: string[];
  lugar_publicacion: string;
  more_authors: boolean;
  servicios_relacionados: string[];
};

export const EditPublicacion = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const { findedDocPublications, loading, setLoading } = useDb({
    dbRoute: "publications",
    id: id,
  });

  const [formData, setFormData] = useState<FormData>({
    titulo_publicacion: "",
    abstract: "",
    archivo: "",
    autor_publicacion: "",
    coautores: Array(5).fill(""),
    fecha_publicacion: "",
    imagenes: [],
    industria_asociada: [],
    keywords: Array(5).fill(""),
    lugar_publicacion: "",
    more_authors: false,
    servicios_relacionados: [],
  });
  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);
  const [openDialogImagenes, setOpenDialogImagenes] = useState(false);
  const [openDialogArchivos, setOpenDialogArchivos] = useState(false);
  const [imageId, setImageId] = useState<null | number>(null);
  const { imagesFromPublications, filesFromPublications } = useStorage({
    publicationsRoute: "/publications/images",
    filesFromPublicationsRoute: "/publications/files",
  });
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
    if (findedDocPublications) {
      setFormData({
        titulo_publicacion: findedDocPublications.titulo_publicacion,
        abstract: findedDocPublications.abstract,
        archivo: findedDocPublications.archivo,
        autor_publicacion: findedDocPublications.autor_publicacion,
        coautores: findedDocPublications.coautores,
        fecha_publicacion: findedDocPublications.fecha_publicacion,
        imagenes: findedDocPublications.imagenes,
        industria_asociada: findedDocPublications.industria_asociada,
        keywords: findedDocPublications.keywords,
        lugar_publicacion: findedDocPublications.lugar_publicacion,
        more_authors: findedDocPublications.more_authors,
        servicios_relacionados: findedDocPublications.servicios_relacionados,
      });
    }
  }, [findedDocPublications]);

  const handleMouseOver = (id: number) => {
    setImageId(id);
  };
  const handleSelectImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, id],
    }));
  };
  const handleDeselectImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((imageId) => imageId !== id),
    }));
  };
  const handleSelectFile = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      archivo: item,
    }));
    toast.success("Archivo seleccionado");
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (index !== undefined && name.startsWith("keywords_")) {
      setFormData((prev) => {
        const updatedKeywords = [...prev.keywords];
        updatedKeywords[index] = value;

        return { ...prev, keywords: updatedKeywords };
      });
    } else {
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

    const newPublicacion = {
      autor_publicacion: formData.autor_publicacion,
      abstract: formData.abstract,
      titulo_publicacion: formData.titulo_publicacion,
      fecha_publicacion: formData.fecha_publicacion,
      servicios_relacionados: formData.servicios_relacionados,
      industria_asociada: formData.industria_asociada,
      lugar_publicacion: formData.lugar_publicacion,
      keywords: formData.keywords,
      imagenes: formData.imagenes,
      archivo: formData.archivo,
    };
    try {
      const docRef = doc(db, "publications", id);
      await updateDoc(docRef, newPublicacion);
      setLoading(false);
      console.log("Publicación actualizada:", newPublicacion);
      setTimeout(() => {
        navigate("/dashboard/publicaciones");
      }, 3000);
      toast.success(
        "Documento actualizado con exito! Dirigiendo a la vista de Publicaciones..."
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen py-20 flex flex-col justify-center items-center text-black bg-neutral-100">
      <form className="mt-8 space-y-6 w-full px-10" onSubmit={handleSubmit}>
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
          {/*Imagenes y archivo*/}
          <div className="w-full flex justify-start items-center gap-10 col-span-2">
            <div className="flex gap-2 items-center">
              <FromDevzButton
                text="Imagenes"
                click={() => setOpenDialogImagenes(true)}
              >
                <Image />
              </FromDevzButton>
              {formData.imagenes.length > 0 && <Check />}
            </div>
            <div className="flex gap-2 items-center">
              <FromDevzButton
                text="Archivo"
                click={() => setOpenDialogArchivos(true)}
              >
                <File />
              </FromDevzButton>
              {formData.archivo && <Check />}
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
        </div>
        <div className="w-full justify-center items-center flex">
          <FromDevzButton
            text={loading ? "" : "Guardar cambios"}
            submitType={true}
          >
            {loading ? (
              <LoaderCircle className="text-neutral-800 animate-spin" />
            ) : (
              <Save />
            )}
          </FromDevzButton>
        </div>
      </form>
      {/*Dialog Imagenes*/}
      <Dialog
        open={openDialogImagenes}
        fullScreen
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <section className="w-full h-full bg-neutral-200">
          <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
            <h3 className="font-semibold text-xl">Seleccione imagenes</h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={() => setOpenDialogImagenes(false)}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
              >
                <X />
              </button>
            </Tooltip>
          </nav>
          <div className="w-full min-h-80 flex flex-wrap py-16 justify-center items-center gap-10 bg-neutral-200">
            {imagesFromPublications &&
              imagesFromPublications.map((item, index) => (
                <div
                  key={index}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseLeave={() => setImageId(null)}
                  className="relative rounded-lg w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                >
                  <div>
                    {formData.imagenes.includes(item) && (
                      <div className="z-20 bg-neutral-200 shadow-lg shadow-neutral-800 border-[.5px] border-neutral-800 w-10 h-10 absolute bottom-0 right-0 flex justify-center items-center rounded-lg">
                        <Check className="text-neutral-900 " />
                      </div>
                    )}
                    <img className="rounded-lg w-44 h-44" src={item} alt="" />
                  </div>

                  <div
                    className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-lg flex justify-center items-center flex-col gap-10 ${
                      imageId === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <FromDevzButtonWithTooltip
                      text={
                        formData.imagenes.includes(item)
                          ? "Deseleccionar"
                          : "Seleccionar"
                      }
                      click={() =>
                        formData.imagenes.includes(item)
                          ? handleDeselectImage(item)
                          : handleSelectImage(item)
                      }
                    >
                      {formData.imagenes.includes(item) ? (
                        <X />
                      ) : (
                        <BoxSelect size={20} />
                      )}
                    </FromDevzButtonWithTooltip>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Dialog>
      {/*Dialog Archivo*/}
      <Dialog
        open={openDialogArchivos}
        fullScreen
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <section className="w-full h-full bg-neutral-200">
          <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
            <h3 className="font-semibold text-xl">Seleccione un archivo</h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={() => setOpenDialogArchivos(false)}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
              >
                <X />
              </button>
            </Tooltip>
          </nav>
          <div className="w-full min-h-80 flex flex-wrap px-10 justify-center items-center gap-10 bg-neutral-200">
            {filesFromPublications &&
              filesFromPublications.map((item, index) => (
                <div
                  className="flex flex-col justify-center items-center gap-2"
                  key={index}
                >
                  <div className="relative w-60 h-60 rounded-lg border-[.5px] border-neutral-800 flex flex-col justify-center items-center gap-10 px-5">
                    {formData.archivo === item.url && (
                      <Check className="text-neutral-800 absolute top-2 right-2" />
                    )}
                    <h3>{truncateText(item.filename, 10)}</h3>
                    <FromDevzButton
                      text="Seleccionar archivo"
                      click={() => handleSelectFile(item.url)}
                    >
                      <BoxSelect />
                    </FromDevzButton>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Dialog>
      <Toaster />
    </section>
  );
};
