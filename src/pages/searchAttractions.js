import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import getAttractions from "../../actions/getAttractions";
import MyMap from "../../components/MyMap";
import InfoCard from "../../components/InfoCard";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import useSortingModal from "../../hooks/useSortingModal";
import { toast } from "react-hot-toast";

const SearchAttractions = ({ attractions }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useSearchParams().get("location");
  const coordinatesLat = useSearchParams().get("coordinatesLat");
  const coordinatesLng = useSearchParams().get("coordinatesLng");
  const [newAttractions, setNewAttractions] = useState([]);
  const [trips, setTrips] = useState(null);

  // ----------------------------- Fetching Trips ----------------------------- //

  const fetchTrips = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/trips/getAllTripsMinimum`
    );
    if (res.data.message === "No trips found!") {
      return;
    } else {
      setTrips(res.data);
    }
  };

  // sorting modal
  const sortingModal = useSortingModal();

  // get current user
  const user = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/getCurrentUser`
    );
    if (res.data.message === "Not logged In!") {
      return;
    } else {
      setCurrentUser(res.data);
    }
  };

  useEffect(() => {
    user();
    fetchTrips();
  }, []);

  const refetchUser = useCallback(() => {
    user();
  }, []);

  // handle soritng
  const handleSort = useCallback(
    (sortingCategory) => {
      sortingModal.setPage("Attractions");
      sortingModal.setCategory(sortingCategory);
      sortingModal.onOpen(sortingCategory);
    },
    [sortingModal]
  );

  // change listings after sorting
  useEffect(() => {
    if (sortingModal.newListings !== [] || undefined || null || 0) {
      setNewAttractions(sortingModal.newListings);
      console.log(sortingModal);
      console.log(newAttractions);
    }
  }, [sortingModal.newListings]);

  // get listings for showing on map
  const [listingForMap, setListingForMap] = useState("");
  const getListingForMap = useCallback((id) => {
    setListingForMap(id);
  }, []);
  const clearListingForMap = useCallback(() => {
    setListingForMap("");
  }, []);

  // ----------------------------- Add to trips  ----------------------------- //
  const addToTrips = useCallback(
    async (listingId) => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/addNewTrip`, {
          listingId: listingId,
        })
        .then(() => toast.success("Dodano nową wycieczkę!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  const addToExistingTrip = useCallback(
    async (listingId, tripId, page) => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/addListingToTrip`, {
          listingId: listingId,
          tripId: tripId,
          page: page,
        })
        .then(() => toast.success("Dodano do istniejącej  wycieczki!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  const deleteFromTrip = useCallback(
    async (listingId, tripId, page) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/trips/deleteListingFromTrip`,
          {
            listingId: listingId,
            tripId: tripId,
            page: page,
          }
        )
        .then(() => toast.success("Usunięto z wycieczki!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  // wyszukujemy listingi , jeżeli nie ma to zwracamy loader
  if (
    attractions === undefined ||
    attractions === null ||
    (attractions.length === 0 && newAttractions.length === 0) ||
    newAttractions === undefined ||
    newAttractions === null
  ) {
    return (
      <div className="overflow-x-hidden">
        <Header placeholder={`${location}`} page="Attractions" />
        <EmptyState showReset />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Header placeholder={`${location} `} page="Attractions" />

      <main className="flex">
        <section className="flex-grow pt-4 px-6 h-screen">
          <p className="text-xs text-gray-400">
            {" "}
            {attractions.length} atrakcji{" "}
          </p>
          <h1 className="text-3xl font-semibold mb-6">
            Atrakcje w miejscowości: {location.toUpperCase()}
          </h1>

          <hr />

          <div
            className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap py-3
            border-b-2 border-gray-200 w-full justify-evenly"
          >
            <p className="font-bold text-3xl text-gray-400">Filtry:</p>
            <span className="button_search" onClick={() => handleSort("Cena")}>
              Cena
            </span>
            <span
              className="button_search"
              onClick={() => handleSort("Opinie")}
            >
              Opinie
            </span>
            <span
              className="button_search"
              onClick={() => handleSort("Kategorie")}
            >
              Kategorie
            </span>
            <span
              className="button_search"
              onClick={() => handleSort("Liczba recenzji")}
            >
              Liczba recenzji
            </span>
          </div>

          <div
            className="flex flex-col lg:overflow-y-scroll h-4/5
            scrollbar scrollbar-thumb-[#3F9337] scrollbar-track-red-100 
            scrollbar-thumb-rounded-xl scrollbar-track-rounded-xl
          "
          >
            {newAttractions.length > 0
              ? newAttractions?.map((item, index) => (
                  <InfoCard
                    key={index}
                    id={item.id}
                    img={item.imageSrc}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    price={item.price}
                    star={item.star}
                    currentUser={currentUser}
                    refetchUser={refetchUser}
                    page="Attractions"
                    getListingForMap={getListingForMap}
                    abilityToAddToTrips
                    addToTrips={addToTrips}
                    trips={trips}
                    addToExistingTrip={addToExistingTrip}
                    deleteFromTrip={deleteFromTrip}
                  />
                ))
              : attractions?.map((item, index) => (
                  <InfoCard
                    key={index}
                    id={item.id}
                    img={item.imageSrc}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    price={item.price}
                    star={item.star}
                    currentUser={currentUser}
                    refetchUser={refetchUser}
                    page="Attractions"
                    getListingForMap={getListingForMap}
                    abilityToAddToTrips
                    addToTrips={addToTrips}
                    trips={trips}
                    addToExistingTrip={addToExistingTrip}
                    deleteFromTrip={deleteFromTrip}
                  />
                ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[600px] 2xl:min-w-[800px] lg:h-screen">
          <MyMap
            searchResults={attractions}
            currentUser={currentUser}
            refetchUser={refetchUser}
            page="Attractions"
            showMarkerForListing={listingForMap}
            coordinatesLat={coordinatesLat}
            coordinatesLng={coordinatesLng}
            clearListingForMap={clearListingForMap}
          />
        </section>
      </main>
    </div>
  );
};

export default SearchAttractions;

export async function getServerSideProps(context) {
  const attractions = await getAttractions();

  return {
    props: {
      attractions,
    }, // will be passed to the page component as props
  };
}
