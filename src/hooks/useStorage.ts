import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../services/firebase";
import { getFileNameFromUrl } from "../utils/decodeFirebaseUrl";

type Props = {
  publicationsRoute?: string;
  projectsRoute?: string;
  filesRoute?: string;
};

export const useStorage = ({
  projectsRoute,
  publicationsRoute,
  filesRoute,
}: Props) => {
  const [imagesFromPublications, setImagesFromPublications] = useState<string[]>([]);
  const [imagesFromProjects, setImagesFromProjects] = useState<string[]>([]);
  const [filesFromPublications, setFilesFromPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



  const fetchStorage = async () => {
    setLoading(true);

    const projectsRef = ref(storage, projectsRoute);
    const publicationsRef = ref(storage, publicationsRoute);
   
    try {
      if (projectsRoute && publicationsRoute) {
        const listaProjects = await listAll(projectsRef);
        const urlProjects = await Promise.all(
          listaProjects.items.map((item) => getDownloadURL(item))
        );
        const listaPublications = await listAll(publicationsRef);
        const urlPublications = await Promise.all(
          listaPublications.items.map((item) => getDownloadURL(item))
        );
        setImagesFromProjects(urlProjects);
        setImagesFromPublications(urlPublications);
      }
      if (filesRoute) {
        const filesRef = ref(storage, filesRoute);
        const listaFiles = await listAll(filesRef);
      
        const urlFiles = await Promise.all(
          listaFiles.items.map(async (item) => {
            const url = await getDownloadURL(item);
            const filename = getFileNameFromUrl(url); // Llamada a la nueva función
            return { filename, url }; // Devuelve el objeto con filename y url
          })
        );
      
        setFilesFromPublications(urlFiles);
      }
    } catch (error) {
      console.error("Error al obtener las imágenes: ", error);
    } finally {
      setLoading(false);
    }
  };
  const Refresh = async () => {
    await fetchStorage();
  };
  useEffect(() => {
    fetchStorage();
  }, []);
  return {
    loading,
    imagesFromProjects,
    imagesFromPublications,
    filesFromPublications,
    Refresh,
  };
};
