import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { attractionTypes } from "@/pages";
import ListingHead from "../listings/ListingHead";
import ListingInfo from "../listings/ListingInfo";
import AttractionBuyTicket from "./AttractionBuyTicket";

const AttractionClient = ({ attraction, currentUser, refetchUser }) => {
  // ----------------------- router
  const router = useRouter();

  // ----------------------- display with types from index.js applies to listing
  const category = useMemo(() => {
    return attractionTypes.find((item) => item.label === attraction.category);
  }, [attraction.category]);

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
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
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6 mb-6">
            <ListingInfo
              user={attraction?.user}
              category={category}
              description={attraction?.description}
              long={attraction?.long}
              lat={attraction?.lat}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <AttractionBuyTicket
                paid={attraction?.paid}
                price={attraction?.price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionClient;
