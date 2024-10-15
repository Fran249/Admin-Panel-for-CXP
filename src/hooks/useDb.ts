import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, getDocs } from "firebase/firestore";

interface Publication {
  id: string;
  abstract: string;
  archivo: string;
  autor_publicacion: string;
  coautores: [string];
  fecha_publicacion: string;
  imagen: string;
  industria_asociada: string;
  keywords: [string];
  lugar_publicacion: string;
  more_authors: boolean;
  servicios_relacionados: string;
  tipo_de_recurso: string;
  titulo_publicacion: string;
  ubicacion: string;
}

interface UseDbProps {
  dbRoute: string;
  id?: string;
}

export const useDb = ({ dbRoute, id }: UseDbProps) => {
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [findedDoc, setFindedDoc] = useState<Publication | null>(null);

  const fetchDb = async () => {
    setLoading(true);
    const q = query(collection(db, dbRoute));
    const querySnapshot = await getDocs(q);

    const docs: Publication[] = [];

    querySnapshot.forEach((doc) => {
      docs.push({
        ...doc.data(),
        id: doc.id,
      } as Publication);
    });

    setPublicaciones(docs);
    if (id) {
      getDocumentById();
    }
    setLoading(false);
  };

  const refreshPublications = async () => {
    await fetchDb();
  };

  const getDocumentById = () => {
    const finded = publicaciones.find((doc) => doc.id === id);
    setFindedDoc(finded || null);
  };

  useEffect(() => {
    if (publicaciones.length > 0 && id) {
      getDocumentById();
    }
  }, [publicaciones, id]);

  useEffect(() => {
    fetchDb();
  }, [dbRoute]);

  return {
    publicaciones,
    loading,
    findedDoc,
    setLoading,
    refreshPublications,  // Agregamos la función aquí
  };
};
