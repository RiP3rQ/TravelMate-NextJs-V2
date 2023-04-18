import React, { useCallback, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import getAttractions from "../../actions/getAttractions";
import MyMap from "../../components/MyMap";
import InfoCard from "../../components/InfoCard";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const searchAttractions = ({ attractions }) => {
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

  // filtrujemy attractions , jeżeli nie ma to zwracamy loader
  if (
    attractions === undefined ||
    attractions === null ||
    attractions.length === 0
  ) {
    return (
      <div className="overflow-x-hidden">
        <Header placeholder={`${location} `} page="Attractions" />
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

          <div
            className="flex flex-col lg:overflow-y-scroll h-4/5
            scrollbar scrollbar-thumb-[#3F9337] scrollbar-track-red-100 
            scrollbar-thumb-rounded-xl scrollbar-track-rounded-xl
          "
          >
            {attractions?.map((item, index) => (
              <InfoCard
                key={index}
                id={item.id}
                img={item.imageSrc}
                title={item.title}
                description={item.description}
                price={item.price}
                star={item.star}
                currentUser={currentUser}
                refetchUser={refetchUser}
                page="Attractions"
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
          />
        </section>
      </main>
    </div>
  );
};

export default searchAttractions;

export async function getServerSideProps(context) {
  const attractions = await getAttractions();

  return {
    props: {
      attractions,
    }, // will be passed to the page component as props
  };
}
