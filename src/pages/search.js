import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InfoCard from "../../components/InfoCard";
import MyMap from "../../components/MyMap";
import getListings from "../../actions/getListings";
import EmptyState from "../../components/EmptyState";
import { useSession } from "next-auth/react";
import axios from "axios";

const Search = ({ listings }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // const [favorites, setFavorites] = useState(null);
  const router = useRouter();
  const { location, activity } = router.query;

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

  // const favorite = async () => {
  //   const res = await axios.get(
  //     "http://localhost:3000//api/favorites/getFavoriteListings"
  //   );
  //   if (res.data.message === "Not logged In!") {
  //     return;
  //   } else {
  //     setFavorites(res.data);
  //   }
  // };

  useMemo(() => {
    user();
    // favorite();
  }, []);

  // filtrujemy listingi , jeżeli nie ma to zwracamy loader
  if (listings === undefined || listings === null || listings.length === 0) {
    return (
      <div className="overflow-x-hidden">
        <Header placeholder={`${location} `} />
        <EmptyState showReset />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Header placeholder={`${location} `} />

      <main className="flex">
        <section className="flex-grow pt-14 px-6 lg:h-screen lg:overflow-y-scroll">
          <p className="text-xs"></p>
          <h1 className="text-3xl font-semibold mt-2 mb-6">
            {activity} w miejscowości: {location}
          </h1>

          <div className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
            <span className="button_search">Możliwość rezygnacji</span>
            <span className="button_search">Typ miejsca</span>
            <span className="button_search">Cena</span>
            <span className="button_search">Liczba pokoi</span>
            <span className="button_search">Więcej filtrów</span>
          </div>

          <div className="flex flex-col">
            {listings?.map((item, index) => (
              <InfoCard
                key={index}
                id={item.id}
                img={item.imageSrc}
                title={item.title}
                description={item.description}
                price={item.price}
                star={item.star}
                currentUser={currentUser}
              />
            ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[600px] 2xl:min-w-[800px] lg:h-screen">
          <MyMap searchResults={listings} />
        </section>
      </main>

      <Footer />
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
