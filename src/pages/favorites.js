import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import axios from "axios";
import { useRouter } from "next/navigation";
import ListingCard from "../../components/listings/ListingCard";
import Heading from "../../components/modals/Heading";

const favorites = () => {
  // ----------------------------- States ----------------------------- //
  const router = useRouter();
  const [favoriteListings, setFavoriteListings] = useState(null);
  const [favoriteAttractions, setFavoriteAttractions] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ----------------------------- User ----------------------------- //
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

  useMemo(() => {
    user();
  }, []);

  const refetchUser = useCallback(() => {
    user();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchFavoriteListings();
    fetchFavoriteAttractions();
  }, [currentUser]);

  // ----------------------------- Fetching Fav Listings ----------------------------- //

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

  // ----------------------------- Fetching Fav Attractions ----------------------------- //

  const fetchFavoriteAttractions = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/favorites/getFavoriteAttractions",
      {
        email: currentUser?.email,
      }
    );
    if (res.data.message === "No favorites found!") {
      return;
    } else {
      setFavoriteAttractions(res.data);
    }
  };

  // ----------------------------- Render if null ----------------------------- //
  if (
    favoriteListings?.length === 0 ||
    (favoriteListings === null && favoriteAttractions?.length === 0) ||
    favoriteAttractions === null
  ) {
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

  // ----------------------------- Render main page----------------------------- //
  return (
    <div>
      <Header />
      <div className="pt-3 px-5">
        <div className=" border-b-2 border-gray-500 w-64">
          <Heading
            title="Polubione noclegi"
            subtitle="Lista polubionych noclegów"
          />
        </div>

        <div
          className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8"
        >
          {favoriteListings?.map((listing) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
              refetchUser={refetchUser}
              page="Listings"
            />
          ))}
        </div>
      </div>

      <div className="pt-3 pl-5">
        <div className="pt-1 border-b-2 border-gray-500 w-64">
          <Heading
            title="Polubione atrakcje"
            subtitle="Lista polubionych atrakcji"
          />
        </div>

        <div
          className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8 mb-8"
        >
          {favoriteAttractions?.map((attraction) => (
            <ListingCard
              currentUser={currentUser}
              key={attraction.id}
              data={attraction}
              refetchUser={refetchUser}
              page="Attractions"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default favorites;
