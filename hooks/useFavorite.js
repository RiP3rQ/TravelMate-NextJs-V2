import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

const useFavorite = ({ listingId, currentUser, refetchUser, page }) => {
  const router = useRouter();

  let hasFavorited;
  if (page === "Listings") {
    hasFavorited = useMemo(() => {
      const list = currentUser?.favoriteIds || [];

      return list.includes(listingId);
    }, [currentUser, listingId]);
  } else if (page === "Attractions") {
    hasFavorited = useMemo(() => {
      const list = currentUser?.favoriteAttractionsIds || [];

      return list.includes(listingId);
    }, [currentUser, listingId]);
  }

  const toggleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();

      if (!currentUser) {
        return toast.error("Musisz się zalogować, aby dodać do ulubionych!");
      }

      try {
        let request;

        if (page === "Listings") {
          if (hasFavorited) {
            request = () =>
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_URL}/api/favorites/${listingId}`,
                  {
                    listingId: listingId,
                    action: "unlike",
                  }
                )
                .then(() => {
                  toast.success("Usunięto nocleg z ulubionych!");
                });
          } else {
            request = () =>
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_URL}/api/favorites/${listingId}`,
                  {
                    listingId: listingId,
                    action: "like",
                  }
                )
                .then(() => {
                  toast.success("Dodano nocleg do ulubionych!");
                });
          }
        }

        if (page === "Attractions") {
          if (hasFavorited) {
            request = () =>
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_URL}/api/favorites/attractions/${listingId}`,
                  {
                    attractionId: listingId,
                    action: "unlike",
                  }
                )
                .then(() => {
                  toast.success("Usunięto atrakcję z ulubionych!");
                });
          } else {
            request = () =>
              axios
                .post(
                  `${process.env.NEXT_PUBLIC_URL}/api/favorites/attractions/${listingId}`,
                  {
                    attractionId: listingId,
                    action: "like",
                  }
                )
                .then(() => {
                  toast.success("Dodano atrakcję do ulubionych!");
                });
          }
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
