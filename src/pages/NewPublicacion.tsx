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
      <form
        action=""
        className="w-[60%] h-full 
        grid grid-cols-4 grid-rows-4 place-items-center
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
      </form>
    </section>
  );
};
