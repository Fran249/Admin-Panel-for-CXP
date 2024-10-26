import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { Publication } from './../components/types/PublicationType';
import { Consultores } from './../components/types/ConsultorType';
import { Projects } from './../components/types/ProjectType';
import { Services } from './../components/types/ServiceType';
interface UseDbProps {
  dbRoute: string;
  id?: string;
}

export const useDb = ({ dbRoute, id }: UseDbProps) => {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [consultores, setConsultores] = useState<Consultores[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(false);
  const [findedDocPublications, setFindedDocPublications] =
    useState<Publication | null>(null);
  const [findedDocConsultores, setfindedDocConsultores] =
    useState<Consultores | null>(null);
    const [findedDocServices, setFindedDocServices] =
    useState<Services | null>(null);
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
    if (dbRoute === "services") {
      const docs: Services[] = [];

      querySnapshot.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        } as Services);
      });
      console.log(docs);
      setServices(docs);
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
    if (dbRoute === "services") {
      const finded = services.find((doc) => doc.id === id);
      setFindedDocServices(finded || null);
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
    if (services.length > 0 && id) {
      getDocumentById();
    }
  }, [publicaciones, projects, consultores,services, id]);

  useEffect(() => {
    fetchDb();
  }, [dbRoute]);

  return {
    publicaciones,
    loading,
    services,
    findedDocPublications,
    findedDocProjects,
    findedDocServices,
    projects,
    consultores,
    findedDocConsultores,
    setLoading,
    refreshPublications, // Agregamos la función aquí
  };
};
