import { create } from "zustand";

const useSortingModal = create((set) => ({
  isOpen: false,
  category: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setCategory: (category) => set({ category }),
}));

export default useSortingModal;
