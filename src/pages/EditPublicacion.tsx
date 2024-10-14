import { useLocation } from "react-router-dom";
import { useDb } from "../hooks/useDb";
import { FileText, LoaderCircle, Save, User } from "lucide-react";
import { FromDevzButton } from "../components/button/FromDevzButton";

export const EditPublicacion = () => {
  const pathname = useLocation().pathname;
  const id = pathname.split("/")[4];
  const { findedDoc, loading } = useDb({ dbRoute: "publications", id: id });
  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";
  const labelClasses = "block text-sm font-medium text-neutral-800 mb-1";
  console.log(findedDoc);
  return (
    <section className="w-full min-h-screen py-20 flex flex-col justify-center items-center text-black bg-neutral-100">
      {loading ? (
        <LoaderCircle className="text-neutral-800 animate-spin" />
      ) : (
        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/*TITULO PUBLICACION*/}
            <div className="col-span-2">
              <label htmlFor="titulo_publicacion" className={labelClasses}>
                Título de la publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="titulo_publicacion"
                  id="titulo_publicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder={`Titulo : ${findedDoc?.titulo_publicacion}`}
                  defaultValue={findedDoc?.titulo_publicacion}
                />
              </div>
            </div>
            <textarea
              placeholder={`Abstract:${findedDoc?.abstract}`}
              defaultValue={findedDoc?.abstract}
            />
            <div>
              <label htmlFor="autor_publicacion" className={labelClasses}>
                Autor de la publicación
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-500" />
                </div>
                <input
                  type="text"
                  name="autor_publicacion"
                  id="autor_publicacion"
                  className={`${inputClasses} pl-10`}
                  placeholder={`Autor: ${findedDoc?.autor_publicacion}`}
                  defaultValue={findedDoc?.autor_publicacion}
                />
              </div>
            </div>
            <input type="date" defaultValue={findedDoc?.fecha_publicacion} />
            {findedDoc?.coautores.map((coautor, index) => (
              <div key={index}>
                <label htmlFor={`coautor_${coautor}`} className={labelClasses}>
                  Coautor {index + 1}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    type="text"
                    name={`coautor_${coautor}`}
                    id={`coautor_${coautor}`}
                    className={`${inputClasses} pl-10`}
                    placeholder={`Coautor_${index + 1}: ${coautor}`}
                    defaultValue={coautor}
                  />
                </div>
              </div>
            ))}
            <div className="col-span-2">
              <label htmlFor="keywords" className={labelClasses}>
                Keywords
              </label>
              <div className="grid grid-cols-2 gap-4">
                {findedDoc?.keywords.map((keyword, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name={`keywords[${index - 1}]`}
                      id={`keywords_${keyword}`}
                      className={inputClasses}
                      placeholder={`Keyword_${index + 1}: ${keyword}`}
                      defaultValue={keyword}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3>Archivo</h3>
              <input type="file" />
            </div>
            <div className="flex flex-col gap-2">
              <h3>Imagen</h3>
              <input type="file" />
            </div>

            <FromDevzButton text="Guardar cambios" submitType={true}>
              <Save />
            </FromDevzButton>
          </div>
        </form>
      )}
    </section>
  );
};
