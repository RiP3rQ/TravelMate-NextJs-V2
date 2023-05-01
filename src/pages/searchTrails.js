import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import getTrails from "../../actions/getTrails";
import MyMap from "../../components/MyMap";
import InfoCard from "../../components/InfoCard";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import useSortingModal from "../../hooks/useSortingModal";

const SearchTrails = ({ trails }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useSearchParams().get("location");
  const coordinatesLat = useSearchParams().get("coordinatesLat");
  const coordinatesLng = useSearchParams().get("coordinatesLng");
  const [newTrails, setNewTrails] = useState([]);

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

  useMemo(() => {
    user();
  }, []);

  const refetchUser = useCallback(() => {
    user();
  }, []);

  // handle soritng
  const handleSort = useCallback(
    (sortingCategory) => {
      sortingModal.setPage("Trails");
      sortingModal.setCategory(sortingCategory);
      sortingModal.onOpen(sortingCategory);
    },
    [sortingModal]
  );

  // change trails after sorting
  useEffect(() => {
    if (sortingModal.newListings !== [] || undefined || null || 0) {
      setNewTrails(sortingModal.newListings);
      console.log(sortingModal);
      console.log(newTrails);
    }
  }, [sortingModal.newListings]);

  // get trail for showing on map
  const [listingForMap, setListingForMap] = useState("");
  const getListingForMap = useCallback((id) => {
    setListingForMap(id);
  }, []);
  const clearListingForMap = useCallback(() => {
    setListingForMap("");
  }, []);

  // wyszukujemy trails , jeżeli nie ma to zwracamy loader
  if (
    trails === undefined ||
    trails === null ||
    (trails.length === 0 && newTrails.length === 0) ||
    newTrails === undefined ||
    newTrails === null
  ) {
    return (
      <div className="overflow-x-hidden">
        <Header placeholder={`${location}`} page="Trails" />
        <EmptyState showReset />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Header placeholder={`${location} `} page="Trails" />

      <main className="flex">
        <section className="flex-grow pt-4 px-6 h-screen">
          <p className="text-xs text-gray-400">
            {" "}
            {trails.length} tras turystycznych{" "}
          </p>
          <h1 className="text-3xl font-semibold mb-6">
            Trasy turystyczne w miejscowości: {location.toUpperCase()}
          </h1>

          <hr />

          <div
            className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap py-3
            border-b-2 border-gray-200 w-full justify-evenly"
          >
            <p className="font-bold text-3xl text-gray-400">Filtry:</p>
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
            {newTrails.length > 0
              ? newTrails?.map((item, index) => (
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
                    page="Trails"
                    getListingForMap={getListingForMap}
                  />
                ))
              : trails?.map((item, index) => (
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
                    page="Trails"
                    getListingForMap={getListingForMap}
                  />
                ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[600px] 2xl:min-w-[800px] lg:h-screen">
          <MyMap
            trailsResults={trails}
            currentUser={currentUser}
            refetchUser={refetchUser}
            page="Trails"
            coordinatesLat={coordinatesLat}
            coordinatesLng={coordinatesLng}
            showMarkerForTrail={listingForMap}
            clearListingForMap={clearListingForMap}
          />
        </section>
      </main>
    </div>
  );
};

export default SearchTrails;

export async function getServerSideProps(context) {
  const trails = await getTrails();

  return {
    props: {
      trails,
    }, // will be passed to the page component as props
  };
}
