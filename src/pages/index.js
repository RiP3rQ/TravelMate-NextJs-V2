import { signOut } from "firebase/auth";
import Head from "next/head";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LargeCard from "../../components/LargeCard";
import MediumCard from "../../components/MediumCard";
import SmallCard from "../../components/SmallCard";
import { auth } from "../../firebase";

export default function Home({ exploreData, cardsData }) {
  // sign out user using firebase
  const SignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="overflow-x-hidden">
      <Head>
        <title>TravelMate</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />
      {/* Banner */}
      <Banner />

      {/* Nearby places */}
      <main className="max-w-7xl mx-auto px-8 sm:px-16">
        <section className="pt-6">
          <h2 className="text-4xl font-semibold pb-5">Atrakcje w pobliżu</h2>

          {/* Pull exploreData from a server - API endpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {exploreData?.map((item, index) => (
              <SmallCard
                key={index}
                img={item.img}
                location={item.location}
                distance={item.distance}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-semibold py-8">
            Nocuj gdziekolwiek chcesz
          </h2>

          {/* Pull cardsData from a server - API endpoints */}
          <div
            className="flex space-x-3 overflow-scroll p-3 -ml-3 overflow-y-hidden 
          scrollbar scrollbar-thumb-red-400 scrollbar-track-red-100 
          scrollbar-thumb-rounded-xl scrollbar-track-rounded-xl"
          >
            {cardsData?.map((item, index) => (
              <MediumCard key={index} img={item.img} title={item.title} />
            ))}
          </div>
        </section>

        <LargeCard
          image="https://links.papareact.com/4cj"
          title="Głodny nowych przygód?"
          description="Wyrusz w podróż swojego życia!"
          buttonText="Zainspiruj się"
        />
      </main>

      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // 1:19:45 structure of the data
  const exploreData = await fetch(
    "https://api.npoint.io/046c5a3ae2b2d2b42a46"
  ).then((res) => res.json());

  const cardsData = await fetch(
    "https://api.npoint.io/990f5033b327717ec38a"
  ).then((res) => res.json());

  return {
    props: {
      exploreData,
      cardsData,
    },
  };
}
