import { create } from "zustand";

const useSortingModal = create((set) => ({
  isOpen: false,
  category: "",
  newListings: [],
  page: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCategory: (category) => set({ category }),
  setNewListings: (newListings) => set({ newListings }),
  setPage: (page) => set({ page }),
}));

export default useSortingModal;
