import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListingCard from "../../components/listings/ListingCard";
import Heading from "../../components/modals/Heading";

const favorites = () => {
  const router = useRouter();
  const [favoriteListings, setFavoriteListings] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const user = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/auth/getCurrentUser"
    );
    if (res.data.message === "Not logged In!") {
      return;
    } else {
      setCurrentUser(res.data);
    }
  };

  const fetchFavoriteListings = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/favorites/getFavoriteListings",
      {
        email: currentUser?.email,
      }
    );
    if (res.data.message === "No favorites found!") {
      return;
    } else {
      setFavoriteListings(res.data);
    }
  };

  useMemo(() => {
    user();
  }, []);

  const refetchUser = useCallback(() => {
    user();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchFavoriteListings();
  }, [currentUser]);

  console.log(favoriteListings);
  console.log(currentUser);

  if (favoriteListings?.length === 0 || favoriteListings === null) {
    return (
      <div>
        <Header />
        <EmptyState
          title="Nie znaleziono ulubionych! "
          subtitle="Wygląda na to, że nie masz ulubionych."
        />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-6">
        <div className="pt-8 border-b-2 border-gray-500 w-64">
          <Heading title="Polubione" subtitle="Lista polubionych noclegów" />
        </div>

        <div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8"
        >
          {favoriteListings?.map((listing) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              refetchUser={refetchUser}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default favorites;
