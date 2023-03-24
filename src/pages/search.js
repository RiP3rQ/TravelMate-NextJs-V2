import { useRouter } from "next/router";
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { format } from "date-fns";
import InfoCard from "../../components/InfoCard";
import MyMap from "../../components/MyMap";

const Search = ({ searchResults }) => {
  const router = useRouter();
  const { location, startDate, endDate, numberOfGuests } = router.query;

  const formattedStartDate = format(new Date(startDate), "dd MMMM yy");
  const formattedEndDate = format(new Date(endDate), "dd MMMM yy");
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <div className="overflow-x-hidden">
      <Header
        placeholder={`${location} | ${range} | ${numberOfGuests} osoby`}
      />

      <main className="flex">
        <section className="flex-grow pt-14 px-6 lg:h-screen lg:overflow-y-scroll">
          <p className="text-xs">
            300+ Noclegów - {range} - {numberOfGuests} osób{" "}
          </p>
          <h1 className="text-3xl font-semibold mt-2 mb-6">
            Noclegi w miejscowości: New York
          </h1>

          <div className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
            <span className="button_search">Możliwość rezygnacji</span>
            <span className="button_search">Typ miejsca</span>
            <span className="button_search">Cena</span>
            <span className="button_search">Liczba pokoi</span>
            <span className="button_search">Więcej filtrów</span>
          </div>

          <div className="flex flex-col">
            {searchResults?.map((item, index) => (
              <InfoCard
                key={index}
                img={item.img}
                location={item.location}
                title={item.title}
                description={item.description}
                star={item.star}
                price={item.price}
                total={item.total}
              />
            ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[350px] 3xl:min-w-[800px] 2xl:min-w-[600px] lg:h-screen">
          <MyMap searchResults={searchResults} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;

export async function getServerSideProps() {
  const searchResults = await fetch(
    "https://api.npoint.io/336fd6854e721dcb338a"
  ).then((res) => res.json());

  return {
    props: {
      searchResults,
    },
  };
}
