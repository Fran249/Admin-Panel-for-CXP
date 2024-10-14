type Props = {
  text: string;
  wordLimit?: number; // `wordLimit` es opcional
};

export const truncateText = ({ text, wordLimit = 3 }: Props): string => {
  if (!text) return ""; // Manejar el caso cuando el texto es undefined o vacío
  const words = text.split(" "); // Divide el texto en palabras
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..."; // Retorna solo las primeras 'wordLimit' palabras
  }
  return text; // Si no hay más de 'wordLimit' palabras, retorna el texto completo
};
