import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import Header from "../../components/Header";
import InfoCard from "../../components/InfoCard";
import MyMap from "../../components/MyMap";
import getListings from "../../actions/getListings";
import EmptyState from "../../components/EmptyState";
import axios from "axios";

const Search = ({ listings }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const location = useSearchParams().get("location");

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

  // filtrujemy listingi , jeżeli nie ma to zwracamy loader
  if (listings === undefined || listings === null || listings.length === 0) {
    return (
      <div className="overflow-x-hidden">
        <Header placeholder={`${location} `} page="Listings" />
        <EmptyState showReset />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Header placeholder={`${location} `} page="Listings" />

      <main className="flex">
        <section className="flex-grow pt-4 px-6 h-screen">
          <p className="text-xs text-gray-400"> {listings.length} noclegów </p>
          <h1 className="text-3xl font-semibold mb-6">
            Noclegi w miejscowości: {location.toUpperCase()}
          </h1>

          <hr />

          <div
            className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap py-3
          border-b-2 border-gray-200 w-full justify-evenly"
          >
            <p className="font-bold text-3xl text-gray-400">Filtry:</p>
            <span className="button_search">Cena</span>
            <span className="button_search">Opinie</span>
            <span className="button_search">Kategorii</span>
            <span className="button_search">Liczbie recenzji</span>
            <span className="button_search">Liczba Gości/Pokoi/Łazienek</span>
          </div>

          <div
            className="flex flex-col lg:overflow-y-scroll h-4/5
            scrollbar scrollbar-thumb-[#3F9337] scrollbar-track-red-100 
            scrollbar-thumb-rounded-xl scrollbar-track-rounded-xl
          "
          >
            {listings?.map((item, index) => (
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
                page="Listings"
              />
            ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[600px] 2xl:min-w-[800px] lg:h-screen">
          <MyMap
            searchResults={listings}
            currentUser={currentUser}
            refetchUser={refetchUser}
            page="Listings"
          />
        </section>
      </main>
    </div>
  );
};

export default Search;

export async function getServerSideProps(context) {
  const listings = await getListings();

  return {
    props: {
      listings,
    }, // will be passed to the page component as props
  };
}
