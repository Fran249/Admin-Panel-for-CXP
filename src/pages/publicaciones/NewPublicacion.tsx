import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../../components/button/FromDevzButton";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  MapPin,
  Calendar,
  File,
  Briefcase,
  Tag,
  Upload,
  LoaderCircle,
  X,
  Check,
  BoxSelect,
  Image,
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Toaster, toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, Tooltip } from "@mui/material";
import { useStorage } from "../../hooks/useStorage";
import { truncateText } from "../../utils/truncateText";
import { getServicios } from "../../utils/getServicios";

type FormData = {
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
  titulo_publicacion: string;
};

export const NewPublicacion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    titulo_publicacion: "",
  });

  const [isServiciosOpen, setIsServiciosOpen] = useState(false);
  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);
  const [openDialogImagenes, setOpenDialogImagenes] = useState(false);
  const [openDialogArchivos, setOpenDialogArchivos] = useState(false);
  const [imageId, setImageId] = useState<null | number>(null);
  const { servicesArray } = getServicios();
  const { imagesFromPublications, filesFromPublications } = useStorage({
    publicationsRoute: "/publications/images",
    filesFromPublicationsRoute: "/publications/files",
  });
  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";
  console.log(servicesArray);
  const handleMouseOver = (id: number) => {
    setImageId(id);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (formData.archivo === item) {
      toast.error("Archivo ya seleccionado");
      return;
    } else {
      setFormData((prev) => ({
        ...prev,
        archivo: item,
      }));
      toast.success("Archivo seleccionado");
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    try {
      const publicationsCollection = collection(db, "publications");

      await addDoc(publicationsCollection, formData);
      setLoading(false);
      setTimeout(() => {
        navigate("/dashboard/publicaciones"); // Navega hacia la ruta deseada
      }, 3000);
      toast.success(
        "Documento creado con éxito! Dirigiendo a la vista de Publicaciones..."
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  const industrias = [
    { value: "mineria", label: "Minería" },
    { value: "hidrocarburos", label: "Hidrocarburos" },
    { value: "renovables", label: "Renovables" },
  ];
  useEffect(() => {
    if (imagesFromPublications?.length > 0) {
      console.log(imagesFromPublications);
    }
    if (filesFromPublications?.length > 0) {
      console.log(filesFromPublications);
    }
  }, []);
  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[95%] px-20"
      >
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Título de la publicación */}
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
                  placeholder="Ingrese el título"
                  value={formData.titulo_publicacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Autor de la publicación*/}
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
                  placeholder="Nombre del autor"
                  value={formData.autor_publicacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Coautores*/}
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label htmlFor={`coautor_${num}`} className={labelClasses}>
                  Coautor {num}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name={`coautor_${num}`}
                    id={`coautor_${num}`}
                    className={`${inputClasses} pl-10`}
                    placeholder={`Nombre del coautor ${num}`}
                    value={formData.coautores[num - 1]}
                    onChange={(e) => {
                      const updatedCoautores = [...formData.coautores];
                      updatedCoautores[num - 1] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        coautores: updatedCoautores,
                      }));
                    }}
                  />
                </div>
              </div>
            ))}
            {/*Abstract*/}
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
                value={formData.abstract}
                onChange={handleInputChange}
              ></textarea>
            </div>
            {/*Lugar de la publicacion */}
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
                  value={formData.lugar_publicacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Fecha de publicacion */}
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
                  value={formData.fecha_publicacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Imagen y archivo*/}
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
              {/* <label htmlFor="imagenes" className={labelClasses}>
                  Imagenes
                </label>
                {previewUrls && (
                  <div className="flex justify-center items-center">
                    {previewUrls.length <= 3 ? (
                      previewUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Preview"
                          className="mt-2 rounded-lg w-32 h-32"
                        />
                      ))
                    ) : (
                      <>
                        {previewUrls.slice(0, 3).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt="Preview"
                            className="mt-2 rounded-lg w-32 h-32"
                          />
                        ))}
                        <h3>Y {previewUrls.length - 3} mas..</h3>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-neutral-200 p-2">
                    <Image className="h-full w-full text-neutral-500" />
                  </span>
                  <input
                    type="file"
                    name="imagenes"
                    id="imagenes"
                    accept="image/*"
                    className="ml-5 bg-neutral-200 py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                    onChange={handleFileChange}
                  />
                </div> */}
            </div>
            {/*Servicios Relacionados*/}
            {servicesArray.length > 0 ? (
              <div>
                <label
                  htmlFor="servicios_relacionados"
                  className={labelClasses}
                >
                  Servicios relacionados
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-neutral-500" />
                  </div>
                  <div
                    className={`${inputClasses} pl-10 cursor-pointer first-letter:uppercase`}
                    onClick={() => setIsServiciosOpen(!isServiciosOpen)}
                  >
                    {formData.servicios_relacionados.length > 0
                      ? formData.servicios_relacionados
                          .map(
                            (service) =>
                              servicesArray.find((s) => s.value === service)
                                ?.label
                          )
                          .join(", ")
                      : "Seleccione un servicio"}
                  </div>
                  {isServiciosOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-neutral-200 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {servicesArray.map((servicio) => (
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
                            className="ml-3 block text-sm text-gray-700 first-letter:uppercase"
                          >
                            {servicio.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-1 flex flex-col">
                <h3 className="font-semibold">
                  No existen servicios cargados...
                </h3>
                <Link to={'/dashboard/servicios/upload'}>
                  <FromDevzButton text="Ir a cargar"></FromDevzButton>
                </Link>
              </div>
            )}
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
            {/*Keywords*/}
            <div className="col-span-2">
              <label htmlFor="keywords" className={labelClasses}>
                Keywords
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num}>
                    <input
                      type="text"
                      name={`keywords[${num - 1}]`}
                      id={`keywords_${num}`}
                      className={inputClasses}
                      placeholder={`Keyword ${num}`}
                      value={formData.keywords[num - 1]}
                      onChange={(e) => {
                        const updatedKeywords = [...formData.keywords];
                        updatedKeywords[num - 1] = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          keywords: updatedKeywords,
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full justify-center items-center flex">
            <FromDevzButton
              text={loading ? "" : "Cargar publicación"}
              submitType={true}
            >
              {loading ? (
                <LoaderCircle className="text-neutral-800 animate-spin" />
              ) : (
                <Upload />
              )}
            </FromDevzButton>
          </div>
        </form>
      </motion.div>
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
          <div className="w-full min-h-80 flex  flex-wrap py-16 justify-center items-center gap-10 bg-neutral-200">
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
