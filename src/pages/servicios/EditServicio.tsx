import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../../components/button/FromDevzButton";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Image,
  Briefcase,
  LoaderCircle,
  BoxSelect,
  X,
  Check,
  Save,
} from "lucide-react";
import {  doc, updateDoc } from "firebase/firestore";

import { Toaster, toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, Tooltip } from "@mui/material";

import { useStorage } from "../../hooks/useStorage";
import { db } from "../../services/firebase";
import { useDb } from "../../hooks/useDb";

type FormData = {
  nombre_servicio: string;
  descripcion_reducida: string;
  descripcion_detallada: string;
  imagen_principal: string;
  imagen_secundaria_1: string;
  imagen_secundaria_2: string;
  industria_relacionada: string[];
  publicaciones_relacionadas: string[];
  consultores_relacionados: string[];
  archivo: string;
  id: string;
};

export const EditServicio = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogPrincipal, setOpenDialogPrincipal] = useState(false);
  const [openDialogSecundario1, setOpenDialogSecundario1] = useState(false);
  const [openDialogSecundario2, setOpenDialogSecundario2] = useState(false);
  const [openDialogPublicaciones, setOpenDialogPublicaciones] = useState(false);
  const [openDialogFiles, setOpenDialogFiles] = useState(false);
  const { imagesFromServices, filesFromServices } = useStorage({
    servicesRoute: "/services/images",
    filesFromServicesRoute: "/services/files",
  });
  const { consultores } = useDb({ dbRoute: "consultores" });
  const { publicaciones } = useDb({ dbRoute: "publications" });
  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);
  const [imageId, setImageId] = useState<null | number>(null);
  const [selectedPublicaciones, setSelectedPublicaciones] = useState<string[]>(
    []
  );
  const [selectedConsultores, setSelectedConsultores] = useState<string[]>([]);
  const { findedDocServices, loading, setLoading } = useDb({
    dbRoute: "services",
    id: id,
  });
  const [formData, setFormData] = useState<FormData>({
    nombre_servicio: "",
    descripcion_reducida: "",
    descripcion_detallada: "",
    imagen_principal: "",
    imagen_secundaria_1: "",
    imagen_secundaria_2: "",
    industria_relacionada: [],
    publicaciones_relacionadas: [],
    consultores_relacionados: [],
    archivo: "",
    id: "",
  });
  useEffect(() => {
    if (findedDocServices) {
      setFormData({
        nombre_servicio: findedDocServices.nombre_servicio,
        descripcion_reducida: findedDocServices.descripcion_reducida,
        descripcion_detallada: findedDocServices.descripcion_detallada,
        imagen_principal: findedDocServices.imagen_principal,
        imagen_secundaria_1: findedDocServices.imagen_secundaria_1,
        imagen_secundaria_2: findedDocServices.imagen_secundaria_2,
        industria_relacionada: findedDocServices.industria_relacionada,
        publicaciones_relacionadas:
          findedDocServices.publicaciones_relacionadas,
        consultores_relacionados: findedDocServices.consultores_relacionados,
        archivo: findedDocServices.archivo,
        id: findedDocServices.id,
      });
      setSelectedConsultores(findedDocServices.consultores_relacionados);
      setSelectedPublicaciones(findedDocServices.publicaciones_relacionadas);
    }
  }, [findedDocServices]);

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDialogPrincipal(false);
    setOpenDialogSecundario1(false);
    setOpenDialogSecundario2(false);
  };
  const handleOpenDialog = (instruction: string) => {
    if (instruction === "principal") {
      setOpenDialogPrincipal(true);
      setOpenDialog(true);
    }
    if (instruction === "secundario1") {
      setOpenDialogSecundario1(true);
      setOpenDialog(true);
    }
    if (instruction === "secundario2") {
      setOpenDialogSecundario2(true);
      setOpenDialog(true);
    }
  };
  const handleOpenDialogRelatedPublicaciones = () => {
    setOpenDialogPublicaciones(true);
  };
  const handleCloseDialogRelatedPublicaciones = () => {
    setOpenDialogPublicaciones(false);
  };
  const handleSelectRelatedConsultores = (item: string) => {
    const checkConsultor = selectedConsultores.includes(item);
    if (checkConsultor) {
      toast.error("Ya está seleccionado");
    } else {
      setSelectedConsultores((prev) => [...prev, item]);
      toast.success("Agregado correctamente");
    }
  };
  const handleDeselecRelatedConsultores = (item: string) => {
    setSelectedConsultores((prev) => prev.filter((i) => i !== item));
    toast.success("Deseleccionado");
  };
  const handleSelectPublicacion = (id: string) => {
    const checkId = selectedPublicaciones.find((item) => item === id);
    if (checkId) {
      toast.error("Ya está seleccionado");
    } else {
      setSelectedPublicaciones((prev) => [...prev, id]);
      toast.success("Agregado correctamente");
    }
  };
  const handleDeselectPublicacion = (id: string) => {
    setSelectedPublicaciones((prev) => prev.filter((item) => item !== id));
    toast.success("Deseleccionado");
  };
  const handleSelectFile = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      archivo: item,
    }));
    toast.success("Archivo seleccionado");
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange =
    (name: keyof Pick<FormData, "industria_relacionada">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item: string) => item !== value),
      }));
    };
  const handleSelectImagePrincipal = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      imagen_principal: item,
    }));
    toast.success("Imagen seleccionada");
  };
  const handleSelectImageSecundaria1 = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      imagen_secundaria_1: item,
    }));
    toast.success("Imagen seleccionada");
  };
  const handleSelectImageSecundaria2 = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      imagen_secundaria_2: item,
    }));
    toast.success("Imagen seleccionada");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const newServicio = {
        nombre_servicio: formData.nombre_servicio,
        descripcion_reducida: formData.descripcion_reducida,
        descripcion_detallada: formData.descripcion_detallada,
        imagen_principal: formData.imagen_principal,
        imagen_secundaria_1: formData.imagen_secundaria_1,
        imagen_secundaria_2: formData.imagen_secundaria_2,
        industria_relacionada: formData.industria_relacionada,
        publicaciones_relacionadas: selectedPublicaciones,
        consultores_relacionados: selectedConsultores,
        archivo: formData.archivo,
      };
      const docRef = doc(db, "services", id);
      await updateDoc(docRef, newServicio);
      setFormData({
        nombre_servicio: "",
        descripcion_reducida: "",
        descripcion_detallada: "",
        imagen_principal: "",
        imagen_secundaria_1: "",
        imagen_secundaria_2: "",
        industria_relacionada: [],
        publicaciones_relacionadas: [],
        consultores_relacionados: [],
        archivo: "",
        id: "",
      })
      setLoading(false);
      console.log("Servicio actualizado:", newServicio);
      setTimeout(() => {
        navigate("/dashboard/servicios");
      }, 3000);
      toast.success(
        "Documento actualizado con exito! Dirigiendo a la vista de Servicios..."
      );
    } catch (error) {
      toast.error("Error al actualizar el documento");
      setLoading(false);
    }

    setLoading(false);
  };

  const industrias = [
    { value: "Hidrocarburos", label: "Hidrocarburos" },
    { value: "Minería", label: "Minería" },
    { value: "Renovables", label: "Renovables" },
  ];

  const handleMouseOver = (id: number) => {
    setImageId(id);
  };
  useEffect(() => {
    if (imagesFromServices?.length > 0) {
      console.log(imagesFromServices);
    }
    if (filesFromServices?.length > 0) {
      console.log(filesFromServices);
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
        <form className="mt-8  space-y-6" onSubmit={handleSubmit}>
          <div className=" grid grid-cols-2 gap-6">
            {/*Nombre del servicio*/}
            <div className="col-span-2">
              <label htmlFor="nombre_servicio" className={labelClasses}>
                Nombre del servicio
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="nombre_servicio"
                  id="nombre_servicio"
                  className={`${inputClasses} pl-10`}
                  placeholder="Nombre del servicio"
                  defaultValue={formData.nombre_servicio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Descripcion reducida*/}
            <div className="col-span-2">
              <label htmlFor="descripcion_reducida" className={labelClasses}>
                Descripcion reducida
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="descripcion_reducida"
                  id="descripcion_reducida"
                  className={`${inputClasses} pl-10`}
                  placeholder="Descripcion reducida"
                  defaultValue={formData.descripcion_reducida}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Descripcion Detallada*/}
            <div className="col-span-2">
              <label htmlFor="descripcion_detallada" className={labelClasses}>
                Descripcion detallada
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <textarea
                  name="descripcion_detallada"
                  id="descripcion_detallada"
                  className={`${inputClasses} pl-10`}
                  placeholder="Descripcion detallada"
                  defaultValue={formData.descripcion_detallada}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Imagenes / Archivo / Publicaciones*/}
            <div className="col-span-2 flex justify-between items-center">
              {/*Imagen principal*/}
              <div className=" flex justify-start items-center gap-2">
                <FromDevzButton
                  text="Imagen principal"
                  click={() => handleOpenDialog("principal")}
                  submitType={false}
                >
                  <Image />
                </FromDevzButton>
                {formData.imagen_principal !== "" ? (
                  <Check className="text-neutral-800" />
                ) : (
                  ""
                )}
              </div>
              {/*Imagen Secundaria 1*/}
              <div className=" flex justify-start items-center gap-2">
                <FromDevzButton
                  text="Imagen secundaria 1"
                  click={() => handleOpenDialog("secundario1")}
                  submitType={false}
                >
                  <Image />
                </FromDevzButton>
                {formData.imagen_secundaria_1 !== "" ? (
                  <Check className="text-neutral-800" />
                ) : (
                  ""
                )}
              </div>
              {/*Imagen Secundaria 2*/}
              <div className=" flex justify-start items-center gap-2">
                <FromDevzButton
                  text="Imagen secundaria 2"
                  click={() => handleOpenDialog("secundario2")}
                  submitType={false}
                >
                  <Image />
                </FromDevzButton>
                {formData.imagen_secundaria_2 !== "" ? (
                  <Check className="text-neutral-800" />
                ) : (
                  ""
                )}
              </div>
              {/*Publicaciones relacionadas*/}
              <div className=" flex justify-start items-center gap-2">
                <FromDevzButton
                  text="Relacionar publicaciones"
                  click={handleOpenDialogRelatedPublicaciones}
                  submitType={false}
                >
                  <FileText />
                </FromDevzButton>
                {selectedPublicaciones.length > 0 ? (
                  <Check className="text-neutral-800 " />
                ) : (
                  ""
                )}
              </div>
              {/*Archivo*/}
              <div className=" flex justify-start items-center gap-2">
                <FromDevzButton
                  text="Archivo"
                  click={() => setOpenDialogFiles(true)}
                  submitType={false}
                >
                  <Image />
                </FromDevzButton>
                {formData.archivo !== "" ? (
                  <Check className="text-neutral-800" />
                ) : (
                  ""
                )}
              </div>
            </div>
            {/*Industrias*/}
            <div className="col-span-2">
              <label htmlFor="servicios_relacionados" className={labelClasses}>
                Industrias
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-neutral-500" />
                </div>
                <div
                  className={`${inputClasses} pl-10 cursor-pointer`}
                  onClick={() => setIsIndustriaOpen(!isIndustriaOpen)}
                >
                  {formData.industria_relacionada.length > 0
                    ? formData.industria_relacionada
                        .map(
                          (industria) =>
                            industrias.find((s) => s.value === industria)?.label
                        )
                        .join(", ")
                    : "Seleccione las industrias"}
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
                          name="industria"
                          defaultValue={industria.value}
                          checked={formData.industria_relacionada.includes(
                            industria.value
                          )}
                          onChange={handleCheckboxChange(
                            "industria_relacionada"
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
            {/*Consultores relacionados*/}
            <div className="col-span-2 flex flex-col justify-center items-center gap-10 min-h-40">
              <h3>Seleccione los consultores relacionados</h3>
              <div className="w-full h-full bg-neutral-800  flex justify-center items-center gap-2 rounded-lg border-[.5px] border-neutral-800">
                {consultores &&
                  consultores.map((item) => (
                    <FromDevzButton
                      borderHover="border-neutral-200"
                      text={item.nombre_completo}
                      click={() =>
                        selectedConsultores.includes(item.id)
                          ? handleDeselecRelatedConsultores(item.id)
                          : handleSelectRelatedConsultores(item.id)
                      }
                    >
                      {selectedConsultores.includes(item.id) && <X size={20} />}
                    </FromDevzButton>
                  ))}
              </div>
            </div>
          </div>
          {/*Publicar servicio*/}
          <div className="w-full justify-center items-center flex">
            <FromDevzButton
              text={`${loading ? "" : "Guardar cambios"}`}
              submitType={true}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <Save />}
            </FromDevzButton>
          </div>
        </form>
      </motion.div>
      {/*Dialog imagenes*/}
      <Dialog open={openDialog} fullScreen sx={{ backgroundColor: "#f5f5f5" }}>
        {openDialogPrincipal && (
          <section className="w-full h-full bg-neutral-200">
            <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
              <h3 className="font-semibold text-xl">Elija una imagen</h3>
              <Tooltip title="Cerrar" className="absolute top-5 right-5">
                <button
                  onClick={handleCloseDialog}
                  className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
                >
                  <X />
                </button>
              </Tooltip>
            </nav>
            <div className="w-full min-h-80 flex flex-wrap py-16 justify-center items-center gap-10 bg-neutral-200">
              {imagesFromServices &&
                imagesFromServices.map((item, index) => (
                  <div
                    key={index}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={() => setImageId(null)}
                    className="relative rounded-lg w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                  >
                    <div>
                      {formData.imagen_principal === item && (
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
                        text="Seleccionar"
                        click={() => handleSelectImagePrincipal(item)}
                      >
                        <BoxSelect size={20} />
                      </FromDevzButtonWithTooltip>
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-full flex justify-center items-center">
              {formData.imagen_principal !== "" ? (
                <FromDevzButton text="Hecho" click={handleCloseDialog}>
                  <Check />
                </FromDevzButton>
              ) : (
                ""
              )}
            </div>
          </section>
        )}
        {openDialogSecundario1 && (
          <section className="w-full h-full bg-neutral-200">
            <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
              <h3 className="font-semibold text-xl">Elija una imagen</h3>
              <Tooltip title="Cerrar" className="absolute top-5 right-5">
                <button
                  onClick={handleCloseDialog}
                  className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
                >
                  <X />
                </button>
              </Tooltip>
            </nav>
            <div className="w-full min-h-80 flex flex-wrap py-16 justify-center items-center gap-10 bg-neutral-200">
              {imagesFromServices &&
                imagesFromServices.map((item, index) => (
                  <div
                    key={index}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={() => setImageId(null)}
                    className="relative rounded-lg w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                  >
                    <div>
                      {formData.imagen_secundaria_1 === item && (
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
                        text="Seleccionar"
                        click={() => handleSelectImageSecundaria1(item)}
                      >
                        <BoxSelect size={20} />
                      </FromDevzButtonWithTooltip>
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-full flex justify-center items-center">
              {formData.imagen_secundaria_1 !== "" ? (
                <FromDevzButton text="Hecho" click={handleCloseDialog}>
                  <Check />
                </FromDevzButton>
              ) : (
                ""
              )}
            </div>
          </section>
        )}
        {openDialogSecundario2 && (
          <section className="w-full h-full bg-neutral-200">
            <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
              <h3 className="font-semibold text-xl">Elija una imagen</h3>
              <Tooltip title="Cerrar" className="absolute top-5 right-5">
                <button
                  onClick={handleCloseDialog}
                  className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
                >
                  <X />
                </button>
              </Tooltip>
            </nav>
            <div className="w-full min-h-80 flex flex-wrap py-16 justify-center items-center gap-10 bg-neutral-200">
              {imagesFromServices &&
                imagesFromServices.map((item, index) => (
                  <div
                    key={index}
                    onMouseOver={() => handleMouseOver(index)}
                    onMouseLeave={() => setImageId(null)}
                    className="relative rounded-lg w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                  >
                    <div>
                      {formData.imagen_secundaria_2 === item && (
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
                        text="Seleccionar"
                        click={() => handleSelectImageSecundaria2(item)}
                      >
                        <BoxSelect size={20} />
                      </FromDevzButtonWithTooltip>
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-full flex justify-center items-center">
              {formData.imagen_secundaria_2 !== "" ? (
                <FromDevzButton text="Hecho" click={handleCloseDialog}>
                  <Check />
                </FromDevzButton>
              ) : (
                ""
              )}
            </div>
          </section>
        )}
      </Dialog>
      {/*Dialog publicaciones relacionadas*/}
      <Dialog
        open={openDialogPublicaciones}
        fullScreen
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <section className="w-full h-full bg-neutral-200">
          <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
            <h3 className="font-semibold text-xl">
              Relacione las publicaciones al servicio
            </h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={handleCloseDialogRelatedPublicaciones}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
              >
                <X />
              </button>
            </Tooltip>
          </nav>
          <div className="w-full min-h-80 flex justify-center items-center gap-10 bg-neutral-200">
            {publicaciones &&
              publicaciones.map((item, index) => (
                <div
                  className="flex flex-col justify-center items-center gap-2"
                  key={index}
                >
                  <div className="relative w-60 h-60 rounded-lg border-[.5px] border-neutral-800 flex flex-col justify-center items-center gap-10 px-5">
                    {selectedPublicaciones.includes(item.id) && (
                      <Check className="text-neutral-800 absolute top-2 right-2" />
                    )}
                    <h3>{item.titulo_publicacion}</h3>
                    {selectedPublicaciones.includes(item.id) ? (
                      <FromDevzButton
                        text="Deseleccionar publicación"
                        click={() => handleDeselectPublicacion(item.id)}
                      >
                        <X />
                      </FromDevzButton>
                    ) : (
                      <FromDevzButton
                        text="Seleccionar publicación"
                        click={() => handleSelectPublicacion(item.id)}
                      >
                        <BoxSelect />
                      </FromDevzButton>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="w-full flex justify-center items-center">
            <FromDevzButton
              text="Hecho"
              click={handleCloseDialogRelatedPublicaciones}
            >
              <Check />
            </FromDevzButton>
          </div>
        </section>
      </Dialog>
      <Dialog
        open={openDialogFiles}
        fullScreen
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <section className="w-full h-full bg-neutral-200">
          <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
            <h3 className="font-semibold text-xl">Seleccione un archivo</h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={() => setOpenDialogFiles(false)}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-lg hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
              >
                <X />
              </button>
            </Tooltip>
          </nav>
          <div className="w-full min-h-80 flex justify-center items-center gap-10 bg-neutral-200">
            {filesFromServices &&
              filesFromServices.map((item, index) => (
                <div
                  className="flex flex-col justify-center items-center gap-2"
                  key={index}
                >
                  <div className="relative w-60 h-60 rounded-lg border-[.5px] border-neutral-800 flex flex-col justify-center items-center gap-10 px-5">
                    {formData.archivo === item.url && (
                      <Check className="text-neutral-800 absolute top-2 right-2" />
                    )}
                    <h3>{item.filename}</h3>
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

          <div className="w-full flex justify-center items-center">
            <FromDevzButton
              text="Hecho"
              click={() => setOpenDialogFiles(false)}
            >
              <Check />
            </FromDevzButton>
          </div>
        </section>
      </Dialog>
      <Toaster />
    </section>
  );
};
