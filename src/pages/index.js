import Head from "next/head";
import Banner from "../../components/Banner";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LargeCard from "../../components/LargeCard";
import MediumCard from "../../components/MediumCard";
import SmallCard from "../../components/SmallCard";

import { FaLeaf, FaMonument, FaWater, FaSkiing, FaMusic } from "react-icons/fa";
import {
  GiCastle,
  GiForestCamp,
  GiHutsVillage,
  GiModernCity,
  GiNightSleep,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { TbBeach, TbPool } from "react-icons/tb";
import {
  MdAir,
  MdFamilyRestroom,
  MdSportsKabaddi,
  MdSportsVolleyball,
} from "react-icons/md";
import { AiOutlineBook, AiOutlineShoppingCart } from "react-icons/ai";

export const types = [
  {
    label: "Blisko plaży",
    icon: TbBeach,
    description: "Ta posiadłość jest blisko plaży!",
  },
  {
    label: "Nowoczesne",
    icon: GiModernCity,
    description: "Ta posiadłość jest w stylu nowoczesnym!",
  },
  {
    label: "Wiejskie",
    icon: GiHutsVillage,
    description: "Ta posiadłość jest na wsi!",
  },
  {
    label: "Z basenem",
    icon: TbPool,
    description: "Ta posiadłość ma piękny basen!",
  },
  {
    label: "Zabytkowe",
    icon: FaMonument,
    description: "Ta posiadłość jest zabytkiem!",
  },
  {
    label: "W górach",
    icon: FaSkiing,
    description: "Ta posiadłość jest w górach!",
  },
  {
    label: "Zamek",
    icon: GiCastle,
    description: "Ta posiadłość jest zamkiem!",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "Ta posiadłość oferuje miejsca campingowe!",
  },
  {
    label: "Luksusowe",
    icon: IoDiamond,
    description: "Ta posiadłość jest nowa oraz posiada luksusowe wnętrze!",
  },
  {
    label: "Nad jeziorem",
    icon: FaWater,
    description: "Ta posiadłość znajduje się nad jeziorem!",
  },
];

export const attractionTypes = [
  {
    label: "Zabytki i miejsca historyczne",
    icon: GiCastle,
    description:
      "Ta atrakcja jest związana z zabytkami lub miejscami historycznymi!",
    notifications: [
      "Aparat fotograficzny",
      "Przewodnik po zabytkach lub informator",
      "Wygodne buty",
      "Okulary przeciwsłoneczne",
      "Woda pitna",
    ],
  },
  {
    label: "Przyroda i krajobrazy",
    icon: FaLeaf,
    description:
      "Ta atrakcja jest związana z przyrodą lub krajobrazem okolicy!",
    notifications: [
      "Latarka lub czołówka",
      "Mapa terenu",
      "Przybory do jedzenia piknikowego (np. koc, koszyk piknikowy)",
      "Okulary przeciwsłoneczne",
      "Woda pitna",
    ],
  },
  {
    label: "Rozrywka i atrakcje dla rodzin",
    icon: MdFamilyRestroom,
    description: "Ta atrakcja jest związana z rozrywką dla rodziny!",
    notifications: [
      "Aparat fotograficzny",
      "Kaski ochronne dla dzieci na niektórych atrakcjach",
      "Przekąski i napoje",
      "Środki przeciwbólowe dla ewentualnych ból głowy lub brzucha",
      "Zestaw kolorowanek i zabawek dla dzieci",
    ],
  },
  {
    label: "Sport i rekreacja",
    icon: MdSportsVolleyball,
    description: "Ta atrakcja jest związana z sportem lub rekreacją!",
    notifications: [
      "Buty sportowe lub buty do biegania",
      "Ręcznik",
      "Woda pitna",
      "Ochraniacz przeciwsłoneczny",
      "Napój izotoniczny lub baton energetyczny",
    ],
  },
  {
    label: "Ekstremalne",
    icon: MdSportsKabaddi,
    description: "Ta atrakcja jest uznawana za ekstremalną!",
    notifications: [
      "Kask i ochraniacze (np. na kolana, łokcie)",
      "Rękawice zabezpieczające dłonie",
      "Środki przeciwbólowe",
      "Woda pitna",
      "Kamizelka ratunkowa",
    ],
  },
  {
    label: "Zakupy",
    icon: AiOutlineShoppingCart,
    description: "Ta atrakcja jest związana z możliwością zakupu dóbr!",
    notifications: [
      "Torba na zakupy",
      "Portfel z wystarczającą ilością gotówki lub karta kredytowa",
      "Lista rzeczy do kupienia",
      "Woda pitna",
      "Zegarek lub telefon z aplikacją do monitorowania wydatków",
    ],
  },
  {
    label: "Muzyka i sztuka",
    icon: FaMusic,
    description: "Ta atrakcja jest związana z muzyką lub sztuką!",
    notifications: [
      "Bilet lub rezerwacja na wydarzenie",
      "Aparat fotograficzny",
      "Notatnik i długopis",
      "Woda pitna",
      "Okulary przeciwsłoneczne (jeśli wydarzenie odbywa się na zewnątrz)",
    ],
  },
  {
    label: "Relaks i odprężenie",
    icon: GiNightSleep,
    description: "Ta atrakcja jest związana z relaksem oraz odpoczynkiem!",
    notifications: [
      "Koc piknikowy lub leżak",
      "Książka lub magazyn",
      "Przekąski i napoje",
      "Muzyka na odtwarzaczu lub słuchawkach",
      "Woda pitna",
    ],
  },
  {
    label: "Na świeżym powietrzu",
    icon: MdAir,
    description: "Ta atrakcja jest związana ze świeżym powietrzem!",
    notifications: [
      "Wodoodporna kurtka lub płaszcz przeciwdeszczowy",
      "Ciepła czapka i rękawice (w sezonie zimowym)",
      "Krem przeciwsłoneczny i okulary przeciwsłoneczne (w sezonie letnim)",
      "Woda pitna",
      "Buty do chodzenia po nierównym terenie",
    ],
  },
  {
    label: "Edukacja i nauka",
    icon: AiOutlineBook,
    description: "Ta atrakcja jest związana z edukacją lub nauką!",
    notifications: [
      "Notatnik i długopis",
      "Aparat fotograficzny",
      "Przekąski i napoje",
      "Mapa lub przewodnik turystyczny",
      "Zapasowe baterie do urządzeń elektronicznych",
    ],
  },
];

export default function Home({ exploreData, cardsData }) {
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
          scrollbar scrollbar-thumb-[#3F9337] scrollbar-track-red-100 
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
