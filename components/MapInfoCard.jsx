import Image from "next/image";
import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import HeartButton from "./HeartButton";
import { fi } from "date-fns/locale";

const MapInfoCard = ({
  id,
  img,
  title,
  description,
  star,
  price,
  currentUser,
  refetchUser,
  page,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (page === "Listings") {
      router.push(`/listings/${id}`);
    } else if (page === "Attractions") {
      router.push(`/attractions/${id}`);
    }
  };

  return (
    <div className="py-2 px-2 relative grid grid-cols-7 bg-slate-200 rounded-xl">
      {/* LEFT */}
      <div className="flex flex-col col-span-5 relative p-1 w-60">
        <div className="absolute top-0 -right-2">
          <HeartButton
            listingId={id}
            currentUser={currentUser}
            refetchUser={refetchUser}
            page={page}
          />
        </div>

        <div className="flex pr-4">
          <h4 className="text-base text-gray-900 font-bold flex-grow">
            {title}
          </h4>
        </div>

        <div className="border-b-[1px] border-slate-500 w-60 " />

        <p className="pt-1 text-xs text-gray-500 flex-grow">{description}</p>

        <div className="flex justify-between items-end pt-5">
          <button
            className="bg-green-800 py-4 px-7 rounded-full text-sm font-bold text-white"
            onClick={handleClick}
          >
            Szczegóły
          </button>
          <div className="flex flex-col">
            <p className="flex flex-row justify-end">
              {star === "0" ? (
                <span className="text-sm font-bold text-red-400">
                  Brak ocen
                </span>
              ) : (
                <>
                  <StarIcon className="h-5 text-red-400 pr-1" />
                  <span className="text-base font-bold">{star}</span>
                </>
              )}
            </p>

            {!price ? (
              <p className="text-base font-semibold">Bezpłatna</p>
            ) : (
              <p className="text-lg font-semibold lg:text-2xl text-right">
                {price} zł
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-2 p-1 h-full w-full">
        <img
          src={img}
          alt={img}
          className="h-full w-full object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default MapInfoCard;
