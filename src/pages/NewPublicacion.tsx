// type Props = {

import { Upload } from "lucide-react";
import { FromDevzButton } from "../components/button/FromDevzButton";

// }

export const NewPublicacion = () => {
  const handleButtonClick = () => {
    console.log("click");
  };
  console.log("estas en new publicaciones");
  return (
    <section className="w-full h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      <div
        className="w-full h-full 
        flex justify-center items-center flex-wrap gap-10
        [&>input]:border-[.5px] [&>input]:border-neutral-700 [&>input]:rounded-lg 
        "
      >
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <FromDevzButton submitType={true} text="Cargar">
          <Upload size={20} />
        </FromDevzButton>
      </div>
    </section>
  );
};
