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
  imagen: string;
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

interface UseDbProps {
  dbRoute: string;
  id?: string;
}

export const useDb = ({ dbRoute, id }: UseDbProps) => {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(false);
  const [findedDocPublications, setFindedDocPublications] = useState<Publication | null>(
    null
  );
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
  };

  useEffect(() => {
    if (publicaciones.length > 0 && id) {
      getDocumentById();
    } if (projects.length > 0 && id) {
      getDocumentById();
    }
  }, [publicaciones,projects, id]);

  useEffect(() => {
    fetchDb();
  }, [dbRoute]);

  return {
    publicaciones,
    loading,
    findedDocPublications,
    findedDocProjects,
    projects,
    setLoading,
    refreshPublications, // Agregamos la función aquí
  };
};
