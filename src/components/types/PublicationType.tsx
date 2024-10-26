
export interface Publication {
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