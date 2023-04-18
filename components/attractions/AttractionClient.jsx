import { useMemo, useState } from "react";
import { attractionTypes } from "@/pages";
import ListingHead from "../listings/ListingHead";
import ListingInfo from "../listings/ListingInfo";
import AttractionBuyTicket from "./AttractionBuyTicket";
import { usePathname } from "next/navigation";
import axios from "axios";
import ReviewCard from "../reviews/ReviewCard";

const AttractionClient = ({ attraction, currentUser, refetchUser }) => {
  // ----------------------- router
  const path = usePathname();
  const attractionId = path?.substring(13);

  // ----------------------- display with types from index.js applies to listing
  const category = useMemo(() => {
    return attractionTypes.find((item) => item.label === attraction.category);
  }, [attraction.category]);

  // ----------------------- get Reviews for attraction
  const [attractionReviews, setAttractionReviews] = useState([]);
  const fetchReviews = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/attractions/getAttractionReviewsById`,
      {
        attractionId: attractionId,
      }
    );
    if (res.data.message === "Reviews not found!") {
      console.log("Reviews not found!");
      return;
    } else {
      setAttractionReviews(res.data);
    }
  };

  useMemo(() => {
    if (attractionId === undefined || attractionId === null) return;
    fetchReviews();
  }, [attractionId]);

  console.log(attractionReviews);

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
          {/* Tytuł / Gwiazdki / zdjęcie */}
          <ListingHead
            title={attraction?.title}
            imageSrc={attraction?.imageSrc}
            description={attraction?.description}
            id={attraction?.id}
            currentUser={currentUser}
            refetchUser={refetchUser}
            star={attraction?.star}
            page="Attractions"
          />
          {/* środkowy div podzielony na 2 części */}
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6 mb-6">
            {/* lewa część - kto dodał / kategorie / mapa*/}
            <ListingInfo
              user={attraction?.user}
              category={category}
              description={attraction?.description}
              long={attraction?.long}
              lat={attraction?.lat}
            />
            {/* prawa część - kupno biletu / informacja o darmowej atrakcji */}
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <AttractionBuyTicket
                paid={attraction?.paid}
                price={attraction?.price}
              />
            </div>
          </div>
          <hr />
          {/* dolna część - recenzje */}

          <h2 className="text-2xl font-semibold">Recenzje </h2>
          <div>
            {attractionReviews.length > 0 ? (
              attractionReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p>Brak recenzji</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionClient;
