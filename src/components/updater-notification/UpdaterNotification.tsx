import { motion } from "framer-motion";
import { Download } from "lucide-react";

import { Tooltip } from "@mui/material";

type Props = {
  version?: string;
  onClick?: () => void;
  openLink?: (url: string) => void;
};
export const UpdaterNotification = ({ version, onClick, openLink }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="z-30 gap-5 absolute bottom-10 right-10 bg-neutral-200 shadow-lg rounded-lg flex justify-center items-center px-4 py-2"
    >
      <div className="flex flex-col gap-2 justify-center items-center text-left">
        <h3>Nueva actualizacion disponible !</h3>
        <button
          onClick={() =>
            openLink &&
            openLink(
              "https://github.com/Fran249/Admin-Panel-for-CXP/releases/latest/"
            )
          }
          className="text-sm text-center text-blue-500 underline hover:text-blue-700 duration-200"
        >
          version {version}
        </button>
      </div>
      <Tooltip title="ACTUALIZAR">
        <button
          onClick={onClick}
          className="duration-300 hover:text-green-700 rounded-lg"
        >
          <Download />
        </button>
      </Tooltip>
    </motion.div>
  );
};
