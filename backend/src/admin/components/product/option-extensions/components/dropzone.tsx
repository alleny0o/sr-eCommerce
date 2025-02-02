import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { Plus } from "@medusajs/icons";

// types
import { OptionExtension } from "../../../../types/option-extension";

type DropzoneProps = {
  updatedOptionExtension: OptionExtension;
  setUpdatedOptionExtension: (updatedOptionExtension: OptionExtension) => void;
  index: number;
};

const DropzoneComponent = (input: DropzoneProps) => {
  const { updatedOptionExtension, setUpdatedOptionExtension, index } = input;

  const onDrop = useCallback(
   async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const tempUrl = URL.createObjectURL(file);

        // Update the option_variation with the new option_image
        const updatedVariations = [...updatedOptionExtension.option_variations];
        updatedVariations[index] = {
          ...updatedVariations[index],
          option_image: {
            temp_url: tempUrl,
            file,
          },
        };

        setUpdatedOptionExtension({
          ...updatedOptionExtension,
          option_variations: updatedVariations,
        });
      }
    },
    [updatedOptionExtension, index, setUpdatedOptionExtension]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const currentImage =
    updatedOptionExtension.option_variations[index]?.option_image;

  return (
    <div
      {...getRootProps({
        className: `relative flex items-center justify-center rounded-md w-10 h-10 cursor-pointer ${
          currentImage
            ? "bg-transparent border-2 border-solid dark:border-zinc-950"
            : "bg-gray-100 dark:bg-zinc-900 border-2 border-dashed dark:border-zinc-950"
        }`,
      })}
    >
      <input {...getInputProps()} />
      {currentImage ? (
        <img
          src={
            "url" in currentImage
              ? currentImage.url
              : "temp_url" in currentImage
              ? currentImage.temp_url
              : ""
          }
          alt={"Uploaded image"} // Display the image name as alt text
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus />
        </div>
      )}
    </div>
  );
};

export const Dropzone = React.memo(DropzoneComponent);
