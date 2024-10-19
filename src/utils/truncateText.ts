export const truncateText = (text: string): string => {
  if (!text) return ""; // Manejar el caso cuando el texto es undefined o vacío
  const words = text.split(" "); // Divide el texto en palabras
  if (words.length > 3) {
    return words.slice(0, 3).join(" ") + "..."; // Retorna solo las primeras 3 palabras
  }
  return text; // Si no hay más de 3 palabras, retorna el texto completo
};