import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../../components/button/FromDevzButton";
import {  useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  MapPin,
  Image,
  Briefcase,
  Upload,
  LoaderCircle,
  Medal,
  Languages,
  BoxSelect,
  X,
  Check,
  Linkedin,
  Mail,
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";

import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, Tooltip } from "@mui/material";

import { useStorage } from "../../hooks/useStorage";
import { db } from "../../services/firebase";
import { useDb } from "../../hooks/useDb";

type FormData = {
  area_de_expertise_1: string;
  area_de_expertise_2: string;
  avatar_image: string;
  especialidad_1: string;
  especialidad_2: string;
  especialidad_3: string;
  especialidad_4: string;
  especialidad_5: string;
  idiomas: string[];
  nombre_completo: string;
  titulo_credencial_1: string;
  titulo_credencial_2: string;
  titulo_credencial_3: string;
  ubicacion: string;
  industria: string[];
  descripcion: string;
  publicaciones_relacionadas: string[];
  linkedin: string;
  email: string;
};

export const NewConsultor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogPublicaciones, setOpenDialogPublicaciones] = useState(false);
  const { imagesFromConsultores } = useStorage({
    consultoresRoute: "/consultores/images",
  });
  const { publicaciones } = useDb({ dbRoute: "publications" });

  const [formData, setFormData] = useState<FormData>({
    area_de_expertise_1: "",
    area_de_expertise_2: "",
    avatar_image: "",
    industria: [],
    idiomas: [],
    especialidad_1: "",
    especialidad_2: "",
    especialidad_3: "",
    especialidad_4: "",
    especialidad_5: "",
    nombre_completo: "",
    titulo_credencial_1: "",
    titulo_credencial_2: "",
    titulo_credencial_3: "",
    ubicacion: "",
    descripcion: "",
    publicaciones_relacionadas: [],
    linkedin: '',
    email: '',
  });

  const [isIndustriaOpen, setIsIndustriaOpen] = useState(false);
  const [isIdiomaOpen, setIsIdiomaOpen] = useState(false);
  const [imageId, setImageId] = useState<null | number>(null);
  const [selectedPublicaciones, setSelectedPublicaciones] = useState<string[]>(
    []
  );

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleOpenDialogRelatedPublicaciones = () => {
    setOpenDialogPublicaciones(true);
  };
  const handleCloseDialogRelatedPublicaciones = () => {
    setOpenDialogPublicaciones(false);
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
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange =
    (name: keyof Pick<FormData, "idiomas" | "industria">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item: string) => item !== value),
      }));
    };
  const handleSelectImage = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      avatar_image: item,
    }));
    toast.success("Imagen seleccionada");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    try {
      const publicationsCollection = collection(db, "consultores");
      const fullDoc = {
        ...formData,
        publicaciones_relacionadas: selectedPublicaciones,
      };
      await addDoc(publicationsCollection, fullDoc);
      setLoading(false);
      setTimeout(() => {
        navigate("/dashboard/consultores"); // Navega hacia la ruta deseada
      }, 3000);
      toast.success(
        "Documento creado con éxito! Dirigiendo a la vista de Consultores..."
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  const idiomas = [
    { value: "Español", label: "Español" },
    { value: "Inglés", label: "Inglés" },
    { value: "Portugués", label: "Portugués" },
    { value: "Francés", label: "Francés" },
    { value: "Alemán", label: "Alemán" },
  ];
  const industrias = [
    { value: "Hidrocarburos", label: "Hidrocarburos" },
    { value: "Minería", label: "Minería" },
    { value: "Renovables", label: "Renovables" },
  ];

  const handleMouseOver = (id: number) => {
    setImageId(id);
  };
  useEffect(() => {
    if (imagesFromConsultores?.length > 0) {
      console.log(imagesFromConsultores);
    }
  }, []);
  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-20"
      >
        <form className="mt-8  space-y-6" onSubmit={handleSubmit}>
          <div className=" grid grid-cols-2 gap-6">
            {/*Nombre completo*/}
            <div className="col-span-2">
              <label htmlFor="nombre_completo" className={labelClasses}>
                Nombre completo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="nombre_completo"
                  id="nombre_completo"
                  className={`${inputClasses} pl-10`}
                  placeholder="Nombre del consultor"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Area de expertise 1 */}
            <div className="col-span-1">
              <label htmlFor="area_de_expertise_1" className={labelClasses}>
                Area de expertise 1
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="area_de_expertise_1"
                  id="area_de_expertise_1"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el area"
                  value={formData.area_de_expertise_1}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/* Area de expertise 2 */}
            <div className="col-span-1">
              <label htmlFor="area_de_expertise_2" className={labelClasses}>
                Area de expertise 2
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="area_de_expertise_2"
                  id="area_de_expertise_2"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el area"
                  value={formData.area_de_expertise_2}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Ubicación */}
            <div>
              <label htmlFor="ubicacion" className={labelClasses}>
                Ubicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="ubicacion"
                  id="ubicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ciudad, País"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Especialidad 1*/}
            <div>
              <label htmlFor="especialidad_1" className={labelClasses}>
                Especialidad 1
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="especialidad_1"
                  id="especialidad_1"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la especialidad"
                  value={formData.especialidad_1}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Especialidad 2*/}
            <div>
              <label htmlFor="especialidad_2" className={labelClasses}>
                Especialidad 2
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="especialidad_2"
                  id="especialidad_2"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la especialidad"
                  value={formData.especialidad_2}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Especialidad 3*/}
            <div>
              <label htmlFor="especialidad_3" className={labelClasses}>
                Especialidad 3
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="especialidad_3"
                  id="especialidad_3"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la especialidad"
                  value={formData.especialidad_3}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Especialidad 4*/}
            <div>
              <label htmlFor="especialidad_4" className={labelClasses}>
                Especialidad 4
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="especialidad_4"
                  id="especialidad_4"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la especialidad"
                  value={formData.especialidad_4}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Especialidad 5*/}
            <div>
              <label htmlFor="especialidad_5" className={labelClasses}>
                Especialidad 5
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="especialidad_5"
                  id="especialidad_5"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la especialidad"
                  value={formData.especialidad_5}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Titulo credencial 1*/}
            <div>
              <label htmlFor="titulo_credencial_1" className={labelClasses}>
                Titulo | Credencial 1
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Medal className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="titulo_credencial_1"
                  id="titulo_credencial_1"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el titulo | credencial"
                  value={formData.titulo_credencial_1}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Titulo credencial 2*/}
            <div>
              <label htmlFor="titulo_credencial_2" className={labelClasses}>
                Titulo | Credencial 2
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Medal className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="titulo_credencial_2"
                  id="titulo_credencial_2"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el titulo | credencial"
                  value={formData.titulo_credencial_2}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Titulo credencial 3*/}
            <div className="col-span-2">
              <label htmlFor="titulo_credencial_3" className={labelClasses}>
                Titulo | Credencial 3
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Medal className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="titulo_credencial_3"
                  id="titulo_credencial_3"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el titulo | credencial"
                  value={formData.titulo_credencial_3}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Imagen*/}
            <div className="col-span-2 flex justify-start items-center gap-2">
              <FromDevzButton
                text="Seleccione un avatar"
                click={handleOpenDialog}
                submitType={false}
              >
                <Image />
              </FromDevzButton>
              {formData.avatar_image !== "" ? (
                <Check className="text-neutral-800" />
              ) : (
                ""
              )}
            </div>
            {/*Publicaciones relacionadas*/}
            <div className="col-span-2 flex justify-start items-center gap-2">
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
            {/*Texto descriptivo*/}
            <div className="col-span-2">
              <label htmlFor="descripcion" className={labelClasses}>
                Texto descriptivo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese la descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Industrias*/}
            <div>
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
                  {formData.industria.length > 0
                    ? formData.industria
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
                          value={industria.value}
                          checked={formData.industria.includes(industria.value)}
                          onChange={handleCheckboxChange("industria")}
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
            {/*Idiomas */}
            <div>
              <label htmlFor="industria_asociada" className={labelClasses}>
                Idiomas
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Languages className="h-5 w-5 text-neutral-500" />
                </div>
                <div
                  className={`${inputClasses} pl-10 cursor-pointer`}
                  onClick={() => setIsIdiomaOpen(!isIdiomaOpen)}
                >
                  {formData.idiomas.length > 0
                    ? formData.idiomas
                        .map(
                          (idioma) =>
                            idiomas.find((i) => i.value === idioma)?.label
                        )
                        .join(", ")
                    : "Seleccione los idiomas"}
                </div>
                {isIdiomaOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-neutral-200 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {idiomas.map((idioma) => (
                      <div
                        key={idioma.value}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          id={idioma.value}
                          name="industria_asociada"
                          value={idioma.value}
                          checked={formData.idiomas.includes(idioma.value)}
                          onChange={handleCheckboxChange("idiomas")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={idioma.value}
                          className="ml-3 block text-sm text-gray-700"
                        >
                          {idioma.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/*Linkedin */}
            <div>
              <label htmlFor="linkedin" className={labelClasses}>
                Linkedin
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Linkedin className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el link hacia Linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {/*Email */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className={`${inputClasses} pl-10`}
                  placeholder="Ingrese el E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/*Publicar consultor*/}
          <div className="w-full justify-center items-center flex">
            <FromDevzButton
              text={`${loading ? "" : "Publicar consultor"}`}
              submitType={true}
            >
              {loading ? <LoaderCircle className="animate-spin" /> : <Upload />}
            </FromDevzButton>
          </div>
        </form>
      </motion.div>
      {/*Dialog imagenes*/}
      <Dialog open={openDialog} fullScreen sx={{ backgroundColor: "#f5f5f5" }}>
        <section className="w-full h-full bg-neutral-200">
          <nav className="relative w-full h-20 flex justify-start items-center px-10 bg-neutral-200">
            <h3 className="font-semibold text-xl">Elija una imagen</h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={handleCloseDialog}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-full hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
              >
                <X />
              </button>
            </Tooltip>
          </nav>
          <div className="w-full min-h-80 flex justify-center items-center gap-10 bg-neutral-200">
            {imagesFromConsultores &&
              imagesFromConsultores.map((item, index) => (
                <div
                  key={index}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseLeave={() => setImageId(null)}
                  className="relative rounded-full w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                >
                  <div>
                    {formData.avatar_image === item && (
                      <div className="z-20 bg-neutral-200 shadow-lg shadow-neutral-800 border-[.5px] border-neutral-800 w-10 h-10 absolute bottom-0 right-0 flex justify-center items-center rounded-full">
                        <Check className="text-neutral-900 " />
                      </div>
                    )}
                    <img className="rounded-full w-44 h-44" src={item} alt="" />
                  </div>

                  <div
                    className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-full flex justify-center items-center flex-col gap-10 ${
                      imageId === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <FromDevzButtonWithTooltip
                      text="Seleccionar"
                      click={() => handleSelectImage(item)}
                    >
                      <BoxSelect size={20} />
                    </FromDevzButtonWithTooltip>
                  </div>
                </div>
              ))}
          </div>
          <div className="w-full flex justify-center items-center">
            {formData.avatar_image !== "" ? (
              <FromDevzButton text="Hecho" click={handleCloseDialog}>
                <Check />
              </FromDevzButton>
            ) : (
              ""
            )}
          </div>
        </section>
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
              Relacione las publicaciones al consultor
            </h3>
            <Tooltip title="Cerrar" className="absolute top-5 right-5">
              <button
                onClick={handleCloseDialogRelatedPublicaciones}
                className="flex justify-center items-center p-1 bg-neutral-200 rounded-full hover:bg-neutral-900 hover:text-neutral-100 text-neutral-900 duration-300"
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
                    <FromDevzButton
                      text="Seleccionar publicación"
                      click={() => handleSelectPublicacion(item.id)}
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
              click={handleCloseDialogRelatedPublicaciones}
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
