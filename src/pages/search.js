import { useRouter } from "next/router";
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InfoCard from "../../components/InfoCard";
import MyMap from "../../components/MyMap";

const Search = () => {
  const router = useRouter();
  const { location, activity } = router.query;

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
            {posts?.map((item, index) => (
              <InfoCard
                key={index}
                img={item.imageSrc}
                title={item.title}
                description={item.description}
                price={item.price}
                star={item.star}
              />
            ))}
          </div>
        </section>

        {/* MAP SECTION  */}
        <section className="hidden lg:inline-flex lg:min-w-[600px] 2xl:min-w-[800px] lg:h-screen">
          {posts && <MyMap searchResults={posts} />}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
