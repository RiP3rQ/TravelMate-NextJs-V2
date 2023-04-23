import Modal from "./Modal";
import useGalleryModal from "../../hooks/useGalleryModal";
import Image from "next/image";
import { useMemo, useState } from "react";

const GalleryModal = () => {
  // ------------------------ images
  const galleryModal = useGalleryModal();
  const images = galleryModal.images;

  const [mainImage, setMainImage] = useState();

  useMemo(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  let bodyContent = (
    <div className="w-full h-full">
      <div className="max-w-[950px] h-[620px] relative mx-auto mb-4">
        {mainImage !== undefined && (
          <Image src={mainImage} alt="Main Photo" fill />
        )}
      </div>
      <hr />
      <div
        className="w-full h-32 overflow-x-auto flex space-x-3 overflow-y-hidden mt-2 justify-center
      scrollbar scrollbar-thumb-[#3F9337] scrollbar-track-red-100 
      scrollbar-thumb-rounded-xl scrollbar-track-rounded-xl
      "
      >
        {images.map((image, index) => {
          return (
            <div className="cursor-pointer hover:scale-105 hover:opacity-75 transition transform duration-300 ease-out">
              <div
                key={index}
                className="w-40 h-full relative "
                onClick={() => {
                  setMainImage(image);
                }}
              >
                <Image
                  src={image}
                  alt="Photo"
                  fill
                  className="rounded-xl border border-gray-400"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Modal
      galleryModal
      isOpen={galleryModal.isOpen}
      onClose={galleryModal.onClose}
      title="Galeria"
      body={bodyContent}
    />
  );
};

export default GalleryModal;
