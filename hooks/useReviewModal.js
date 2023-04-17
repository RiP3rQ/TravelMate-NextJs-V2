import { create } from "zustand";

const useReviewModal = create((set) => ({
  isOpen: false,
  page: "",
  itemId: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setPage: (page) => set({ page }),
  setItemId: (itemId) => set({ itemId }),
}));

export default useReviewModal;
