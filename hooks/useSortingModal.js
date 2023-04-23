import { create } from "zustand";

const useSortingModal = create((set) => ({
  isOpen: false,
  category: "",
  newListings: [],
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCategory: (category) => set({ category }),
  setNewListings: (newListings) => set({ newListings }),
}));

export default useSortingModal;
