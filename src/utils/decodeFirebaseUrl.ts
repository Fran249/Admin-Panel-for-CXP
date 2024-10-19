

export function getFileNameFromUrl(url: string): string {
  try {
    // Decodifica la URL
    const decodedUrl = decodeURIComponent(url);
    
    // Extrae el nombre del archivo usando la última parte de la ruta
    const parts = decodedUrl.split('/');
    const lastSegment = parts[parts.length - 1];
    
    // Remueve cualquier parte de la cadena que empieza con '?'
    const filename = lastSegment.split('?')[0];

    return filename; // Devuelve solo el nombre del archivo
  } catch (error) {
    console.error("Error desestructurando la URL:", error);
    return ""; // Manejo de errores, en caso de que la URL no sea válida
  }
}