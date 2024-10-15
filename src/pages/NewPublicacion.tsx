import { FromDevzButton } from "../components/button/FromDevzButton";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  MapPin,
  Calendar,
  Image,
  File,
  Briefcase,
  Tag,
  Upload,
  LoaderCircle,
} from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toaster, toast } from "sonner";

export const NewPublicacion = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    abstract: "",
    archivo: null as File | null,
    autor_publicacion: "",
    coautores: Array(5).fill(""),
    fecha_publicacion: "",
    imagen: null as File | null,
    industria_asociada: "",
    keywords: Array(5).fill(""),
    lugar_publicacion: "",
    more_authors: false,
    servicios_relacionados: "",
    tipo_de_recurso: "",
    titulo_publicacion: "",
    ubicacion: "",
  });

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    try {
      const projectsCollection = collection(db, "publications");

      // Cargar la imagen en Firebase Storage
      let imageUrl = null;
      if (formData.imagen) {
        const storageRef = ref(
          storage,
          `publications/images/${formData.imagen.name}`
        );
        await uploadBytes(storageRef, formData.imagen);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Cargar el archivo en Firebase Storage
      let fileUrl = null;
      if (formData.archivo) {
        const storageRef = ref(
          storage,
          `publications/files/${formData.archivo.name}`
        );
        await uploadBytes(storageRef, formData.archivo);
        fileUrl = await getDownloadURL(storageRef);
      }

      // Agregar las URLs de la imagen y archivo al formData
      const updatedFormData = {
        ...formData,
        imagen: imageUrl,
        archivo: fileUrl,
      };

      // Agregar el documento a Firestore con las URLs
      await addDoc(projectsCollection, updatedFormData); // Cambiado data a project
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/dashboard/publicaciones";
      }, 3000);
      toast.success(
        "Documento creado con exito! Dirigiendo a la vista de Publicaciones..."
      );
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
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

              <div>
                <label htmlFor="imagen" className={labelClasses}>
                  Imagen
                </label>
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
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="archivo" className={labelClasses}>
                  Archivo
                </label>
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
                    onChange={handleFileChange}
                  />
                </div>
              </div>

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
                  <select
                    name="servicios_relacionados"
                    id="servicios_relacionados"
                    className={`${inputClasses} pl-10`}
                    value={formData.servicios_relacionados}
                    onChange={handleSelectChange}
                  >
                    <option value="">Seleccione un servicio</option>
                    <option value="consultoria">Consultoría</option>
                    <option value="desarrollo">Desarrollo</option>
                    <option value="diseño">Diseño</option>
                  </select>
                </div>
              </div>

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
                    value={formData.industria_asociada}
                    onChange={handleSelectChange}
                  >
                    <option value="">Seleccione una industria</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="construccion">Construcción</option>
                    <option value="salud">Salud</option>
                  </select>
                </div>
              </div>

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
              <FromDevzButton text="Cargar publicación" submitType={true}>
                <Upload />
              </FromDevzButton>
            </div>
          </form>
        </motion.div>
      )}
      <Toaster />
    </section>
  );
};
