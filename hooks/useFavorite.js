import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

const useFavorite = ({ listingId, currentUser, refetchUser }) => {
  const router = useRouter();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModal.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () =>
            axios
              .post(`http://localhost:3000/api/favorites/${listingId}`, {
                listingId: listingId,
                action: "unlike",
              })
              .then(() => {
                toast.success("Usunięto z ulubionych!");
              });
        } else {
          request = () =>
            axios
              .post(`http://localhost:3000/api/favorites/${listingId}`, {
                listingId: listingId,
                action: "like",
              })
              .then(() => {
                toast.success("Dodano do ulubionych!");
              });
        }

        await request();
        refetchUser();
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [currentUser, hasFavorited, listingId, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
