import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, getDocs } from "firebase/firestore";

interface Publication {
  titulo_publicacion: string;
  id: string;
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
}

interface Projects {
  imagenes: string[] | [];
  id: string;
  nombre_proyecto: string;
  texto_1: string;
  texto_2: string;
  tipo_de_recurso: string;
  industria_asociada: string[];
  ubicacion_localidad: string;
  ubicacion_pais: string;
  latitude: string;
  longitude: string;
}
interface Consultores {
  area_de_expertise_1: string;
  industria: string[];
  id: string;
  idiomas: string[];
  descripcion: string;
  area_de_expertise_2: string;
  avatar_image: string;
  especialidad_1: string;
  especialidad_2: string;
  especialidad_3: string;
  especialidad_4: string;
  especialidad_5: string;
  idiomas_1: string;
  idiomas_2: string;
  idiomas_3: string;
  nombre_completo: string;
  titulo_credencial_1: string;
  titulo_credencial_2: string;
  titulo_credencial_3: string;
  ubicacion: string;
  publicaciones_relacionadas: string[];
  linkedin: string;
  email: string;
}

interface UseDbProps {
  dbRoute: string;
  id?: string;
}

export const useDb = ({ dbRoute, id }: UseDbProps) => {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [consultores, setConsultores] = useState<Consultores[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(false);
  const [findedDocPublications, setFindedDocPublications] =
    useState<Publication | null>(null);
  const [findedDocConsultores, setfindedDocConsultores] =
    useState<Consultores | null>(null);
  const [findedDocProjects, setFindedDocProjects] = useState<Projects | null>(
    null
  );

  const fetchDb = async () => {
    setLoading(true);
    const q = query(collection(db, dbRoute));
    const querySnapshot = await getDocs(q);

    if (dbRoute === "publications") {
      const docs: Publication[] = [];

      querySnapshot.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        } as Publication);
      });
      console.log(docs);
      setPublicaciones(docs);
      if (id) {
        getDocumentById();
      }
    }
    if (dbRoute === "consultores") {
      const docs: Consultores[] = [];

      querySnapshot.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        } as Consultores);
      });
      console.log(docs);
      setConsultores(docs);
      if (id) {
        getDocumentById();
      }
    }
    if (dbRoute === "projects") {
      const docs: Projects[] = [];

      querySnapshot.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        } as Projects);
      });

      setProjects(docs);
      if (id) {
        getDocumentById();
      }
    }
    setLoading(false);
  };

  const refreshPublications = async () => {
    await fetchDb();
  };

  const getDocumentById = () => {
    if (dbRoute === "publications") {
      const finded = publicaciones.find((doc) => doc.id === id);
      setFindedDocPublications(finded || null);
    }
    if (dbRoute === "projects") {
      const finded = projects.find((doc) => doc.id === id);
      setFindedDocProjects(finded || null);
    }
    if (dbRoute === "consultores") {
      const finded = consultores.find((doc) => doc.id === id);
      setfindedDocConsultores(finded || null);
    }
  };

  useEffect(() => {
    if (publicaciones.length > 0 && id) {
      getDocumentById();
    }
    if (projects.length > 0 && id) {
      getDocumentById();
    }
    if (consultores.length > 0 && id) {
      getDocumentById();
    }
  }, [publicaciones, projects, consultores, id]);

  useEffect(() => {
    fetchDb();
  }, [dbRoute]);

  return {
    publicaciones,
    loading,
    findedDocPublications,
    findedDocProjects,
    projects,
    consultores,
    findedDocConsultores,
    setLoading,
    refreshPublications, // Agregamos la función aquí
  };
};
