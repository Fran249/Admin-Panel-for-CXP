import { motion } from "framer-motion";
import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../button/FromDevzButton";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { useState } from "react";
type Props = {
  items: any[];
  handleButtonClick: () => void;
  imageFormatter: boolean;
  documentFormatter: boolean;
  fileFormatter: boolean
};

export const Table = ({
  items,
  handleButtonClick,
  imageFormatter,
  documentFormatter,
  fileFormatter
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageId, setImageId] = useState<null | number>(null);

  let itemsPerPage;
  

  if (imageFormatter === true) {
    itemsPerPage = 10;
  } else if (documentFormatter === true) {
    itemsPerPage = 5; 
  } else if(fileFormatter === true) {
    itemsPerPage = 10;
  }else {
    itemsPerPage = 1
  }
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
  const handleMouseOver = (id: number) => {
    setImageId(id);
  };
  return (
    <>
      {documentFormatter && (
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
      )}
      {imageFormatter && (
        <div className="w-full h-[calc(100%-80px)] flex justify-center items-center flex-wrap gap-10">
          {currentItems.map((item, index) => (
            <motion.div
              onMouseOver={() => handleMouseOver(item.id)}
              onMouseLeave={() => setImageId(null)}
              className="relative rounded-xl w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200 "
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5, delay: index / 10 }}
              variants={stackVariants}
            >
              <img className=" rounded-xl w-44 h-44" src={item.url} alt="" />

              <div
                className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-xl flex justify-center items-center flex-col gap-10 ${
                  imageId === item.id ? "opacity-100" : "opacity-10"
                }`}
              >
                <FromDevzButtonWithTooltip
                  text="ELIMINAR"
                  click={handleButtonClick}
                >
                  <Trash size={20} />
                </FromDevzButtonWithTooltip>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {fileFormatter && (
        <div className="w-full h-[calc(100%-80px)] flex justify-center items-center flex-wrap gap-10">
          {currentItems.map((item, index) => (
            <motion.div
              onMouseOver={() => handleMouseOver(item.id)}
              onMouseLeave={() => setImageId(null)}
              className="relative rounded-xl w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200 "
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5, delay: index / 10 }}
              variants={stackVariants}
            >
              <div className="w-full h-full relative rounded-xl bg-neutral-200 font-archivo text-neutral-100 ">
                  <div className="bg-red-500 w-full h-20 rounded-t-xl absolute top-0 right-0 flex justify-center items-center">
                    <h3>{item.nombre}.pdf</h3>
                  </div>
              </div>

              <div
                className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-xl flex justify-center items-center flex-col gap-10 ${
                  imageId === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <FromDevzButtonWithTooltip
                  text="ELIMINAR"
                  click={handleButtonClick}
                >
                  <Trash size={20} />
                </FromDevzButtonWithTooltip>
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
          disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
        >
          <ChevronRight />
        </button>
      </div>
    </>
  );
};
