import { motion } from "framer-motion";
import { FromDevzButton } from "../button/FromDevzButton";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { useState } from "react";
type Props = {
  items: any[];
  handleButtonClick: () => void;
};

export const Table = ({ items, handleButtonClick }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const stackVariants = {
    hidden: { opacity: 0, x: 20 }, // Comienza oculto hacia abajo
    visible: { opacity: 1, x: 0 }, // Se anima a su posición normal
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(items.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <>
      <motion.div
        className=" overflow-x-auto rounded-xl border-[.5px] border-neutral-800"
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.5, delay: 0.1 }}
        variants={stackVariants}
      >
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800 tracking-wider">
                Publicación
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800 tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800 tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-100 divide-y divide-neutral-800">
            {currentItems.map((pub) => (
              <tr key={pub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                  {pub.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                  {pub.fecha}
                </td>
                <td className="px-6 py-4  whitespace-nowrap text-sm text-neutral-800 flex gap-2">
                  <FromDevzButton text="Editar" click={handleButtonClick}>
                    <Edit size={20} />
                  </FromDevzButton>
                  <FromDevzButton text="Eliminar" click={handleButtonClick}>
                    <Trash size={20} />
                  </FromDevzButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      <div className="w-full h-20 flex justify-center items-center gap-2 text-neutral-800">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="disabled:text-neutral-600"
        >
          <ChevronLeft />
        </button>
        <span>{currentPage}</span>
        <button
          onClick={nextPage}
          className="disabled:text-neutral-600"
          disabled={
            currentPage === Math.ceil(items.length / itemsPerPage)
          }
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
};
