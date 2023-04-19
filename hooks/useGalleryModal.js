import { create } from "zustand";

const useGalleryModal = create((set) => ({
  isOpen: false,
  images: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setImages: (images) => set({ images }),
}));

export default useGalleryModal;
