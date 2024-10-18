import { FromDevzButton } from "../../components/button/FromDevzButton";
import { Save } from "lucide-react";
import React, { useState } from "react";

export const NewImagen = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convertir los archivos a un array
      setSelectedImages(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file)); // Crear URLs de vista previa
      setPreviewUrls(previews);
    }
  };

  const inputClasses =
    "w-full p-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-200 text-neutral-800";

  return (
    <section className="w-full min-h-screen py-20 bg-neutral-100 flex flex-col justify-center items-center">
      <div className="flex flex-col gap-10">
        {previewUrls.length > 0 && (
          <div className="flex flex-col justify-center items-center gap-5">
            <h3 className="border-[.5px] border-neutral-800 p-2 rounded-lg text-neutral-800 font-archivo font-semibold">
              Vista previa de las imágenes
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {previewUrls.map((previewUrl, index) => (
                <img
                  key={index}
                  src={previewUrl}
                  alt={`Vista previa ${index + 1}`}
                  className="w-[100px] h-[100px] object-cover"
                />
              ))}
            </div>
          </div>
        )}
        <input
          className={inputClasses}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        {selectedImages.length > 0 && (
          <div className="w-full flex justify-center items-center">
            <FromDevzButton text="Cargar imagen" >
              <Save />
            </FromDevzButton>
          </div>
        )}
      </div>
    </section>
  );
};
