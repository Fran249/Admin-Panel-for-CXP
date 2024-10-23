import { motion } from "framer-motion";
import {
  FromDevzButton,
  FromDevzButtonWithTooltip,
} from "../button/FromDevzButton";
import { ChevronLeft, ChevronRight, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";
import { truncateText } from "../../utils/truncateText";

type Props = {
  items?: any[];
  items1?: any[];
  items2?: any[];
  files?: any[];
  handleButtonClick: (pub: any) => void;
  imageFormatter?: boolean;
  documentFormatter?: boolean;
  fileFormatter?: boolean;
  consultorFormatter?: boolean;
  tableTitle?: string;
};

export const Table = ({
  items = [],
  items1,
  items2,
  files,
  handleButtonClick,
  imageFormatter,
  documentFormatter,
  fileFormatter,
  consultorFormatter,
  tableTitle,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageId, setImageId] = useState<null | number>(null);

  let itemsPerPage;

  if (imageFormatter) {
    itemsPerPage = 10;
  } else if (documentFormatter) {
    itemsPerPage = 5;
  } else if (fileFormatter) {
    itemsPerPage = 10;
  } else if (consultorFormatter) {
    itemsPerPage = 5;
  } else {
    itemsPerPage = 1;
  }

  const stackVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems1 = items1?.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems2 = items2?.slice(indexOfFirstItem, indexOfLastItem);
  const currentFiles = files?.slice(indexOfFirstItem, indexOfLastItem);
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
          className="overflow-x-auto rounded-xl border-[.5px] border-neutral-800"
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
                  {tableTitle}
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
                    {pub.titulo_publicacion || pub.nombre_proyecto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                    {pub.fecha_publicacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800 flex gap-2">
                    <Link to={`edit/${pub.id}`}>
                      <FromDevzButton text="Editar">
                        <Edit size={20} />
                      </FromDevzButton>
                    </Link>
                    <FromDevzButton
                      text="Eliminar"
                      click={() => handleButtonClick(pub)}
                    >
                      <Trash size={20} />
                    </FromDevzButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
      {consultorFormatter && (
        <motion.div
          className="overflow-x-auto rounded-xl border-[.5px] border-neutral-800"
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
                  {tableTitle}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-800 tracking-wider">
                  Ubicación
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
                    {pub.nombre_completo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                    {pub.ubicacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800 flex gap-2">
                    <Link to={`edit/${pub.id}`}>
                      <FromDevzButton text="Editar">
                        <Edit size={20} />
                      </FromDevzButton>
                    </Link>
                    <FromDevzButton
                      text="Eliminar"
                      click={() => handleButtonClick(pub)}
                    >
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
        <>
          <div className="flex justify-start items-center">
            <h3 className="text-xl font-semibold my-10 rounded-lg border-[.5px] border-neutral-800 px-2 py-1 bg-neutral-800 text-neutral-200">
              Publicaciones
            </h3>
          </div>
          <div className="w-full h-[calc(100%-80px)] flex justify-center items-center flex-wrap gap-10">
            {currentItems1?.map((item, index) => (
              <motion.div
                key={index}
                onMouseOver={() => handleMouseOver(item)}
                onMouseLeave={() => setImageId(null)}
                className="relative rounded-xl w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: index / 10 }}
                variants={stackVariants}
              >
                <img className="rounded-xl w-44 h-44" src={item} alt="" />

                <div
                  className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-xl flex justify-center items-center flex-col gap-10 ${
                    imageId === item ? "opacity-100" : "opacity-10"
                  }`}
                >
                  <FromDevzButtonWithTooltip
                    text="Eliminar"
                    click={() => handleButtonClick(item)}
                  >
                    <Trash size={20} />
                  </FromDevzButtonWithTooltip>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="my-10">
            <Divider></Divider>
          </div>
          <div className="flex justify-start items-center">
            <h3 className="text-xl font-semibold my-10 rounded-lg border-[.5px] border-neutral-800 px-2 py-1 bg-neutral-800 text-neutral-200">
              Proyectos
            </h3>
          </div>
          <div className="w-full h-[calc(100%-80px)] flex justify-center items-center flex-wrap gap-10">
            {currentItems2?.map((item, index) => (
              <motion.div
                key={index}
                onMouseOver={() => handleMouseOver(item)}
                onMouseLeave={() => setImageId(null)}
                className="relative rounded-xl w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.5, delay: index / 10 }}
                variants={stackVariants}
              >
                <img className="rounded-xl w-44 h-44" src={item} alt="" />

                <div
                  className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-xl flex justify-center items-center flex-col gap-10 ${
                    imageId === item ? "opacity-100" : "opacity-10"
                  }`}
                >
                  <FromDevzButtonWithTooltip
                    text="Eliminar"
                    click={() => handleButtonClick(item)}
                  >
                    <Trash size={20} />
                  </FromDevzButtonWithTooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {fileFormatter && (
        <div className="w-full h-[calc(100%-80px)] flex justify-center items-center flex-wrap gap-10">
          {currentFiles?.map((item, index) => (
            <motion.div
              key={index}
              onMouseOver={() => handleMouseOver(item.filename)}
              onMouseLeave={() => setImageId(null)}
              className="relative rounded-xl w-44 h-44 hover:shadow-xl hover:shadow-neutral-900 cursor-pointer transition-shadow duration-200"
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5, delay: index / 10 }}
              variants={stackVariants}
            >
              <div className="w-full h-full relative rounded-xl bg-neutral-200 font-archivo text-neutral-100">
                <div className="px-2 bg-neutral-800 w-full h-20 rounded-t-xl absolute top-0 right-0 flex justify-center items-center">
                  <h3>{truncateText(item.filename)} .PDF</h3>
                </div>
              </div>

              <div
                className={`transition-opacity duration-300 bg-[#000000b6] w-full h-full absolute top-0 right-0 rounded-xl flex justify-center items-center flex-col gap-10 ${
                  imageId === item.filename ? "opacity-100" : "opacity-0"
                }`}
              >
                <FromDevzButtonWithTooltip
                  text="Eliminar"
                  click={() => handleButtonClick(item)}
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
