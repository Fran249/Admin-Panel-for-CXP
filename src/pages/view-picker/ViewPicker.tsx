import { Shuffle, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export const ViewPicker = () => {
  return (
    <section className="bg-neutral-950 text-neutral-200 w-full min-h-screen py-20 flex gap-10 justify-center items-center ">
      <Link to={"/dashboard/publicaciones"}>
        <div className="relative w-60 h-60 flex flex-col gap-10 justify-center items-center rounded-xl border-[.5px] duration-300 hover:text-neutral-950 border-neutral-200 hover:bg-white [&>h3]:hover:translate-y-5 [&>div]:hover:visible">
          <div className="invisible absolute top-10">
            <Upload size={40} className="animate-bounce"/>
          </div>

          <h3 className="text-4xl font-extrabold text-center duration-300">
            PANEL DE CARGA
          </h3>
        </div>
      </Link>
      <Link to={"/image-converter"}>
        <div className="relative px-5 min-w-60 h-60 flex flex-col gap-10 justify-center items-center rounded-xl border-[.5px] duration-300 hover:text-neutral-950 border-neutral-200 hover:bg-white [&>h3]:hover:translate-y-5 [&>div]:hover:visible">
          <div className="icon invisible absolute top-8">
            <Shuffle size={40} className="animate-bounce"/>
          </div>

          <h3 className="text-4xl font-extrabold text-center duration-300 ">
            CONVERSOR <br /> DE <br /> IMAGENES
          </h3>
        </div>
      </Link>
    </section>
  );
};
