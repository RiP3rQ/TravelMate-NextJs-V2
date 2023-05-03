import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import HeartButton from "./HeartButton";
import { useRouter } from "next/navigation";
import { TrailTypes, attractionTypes, types } from "@/pages";
import {
  BsCalendar2Plus,
  BsCalendarXFill,
  BsFillPinMapFill,
} from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";

const InfoCard = ({
  img,
  id,
  title,
  description,
  category,
  price,
  star,
  currentUser,
  refetchUser,
  page,
  getListingForMap,
  abilityToAddToTrips,
  addToTrips,
  trips,
  addToExistingTrip,
  deleteFromTrip,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (page === "Listings") {
      router.push(`/listings/${id}`);
    }
    if (page === "Attractions") {
      router.push(`/attractions/${id}`);
    }
    if (page === "Trails") {
      router.push(`/trails/${id}`);
    }
  };

  // ----------------------- kategorie -----------------------
  const {
    label: CategoryLabel,
    description: CategoryDescription,
    icon: Icon,
  } = useMemo(() => {
    if (page === "Attractions") {
      return attractionTypes.find((item) => item.label === category);
    } else if (page === "Listings") {
      return types.find((item) => item.label === category);
    } else if (page === "Trails") {
      return TrailTypes.find((item) => item.label === category);
    }
  }, [category, page]);

  // Możlwiość dodania do wycieczki
  const [showDropdownTripsMenu, setShowDropdownTripsMenu] = useState(false);

  // Sprawdzenie czy dany listing jest już w wycieczce
  const isInTrip = useMemo(() => {
    if (!trips) {
      return false;
    }

    let isInTrip;

    if (page === "Attractions") {
      const listingIds = trips.map((trip) => trip.attractionIds).flat();

      isInTrip = listingIds.includes(id);
    } else if (page === "Trails") {
      const listingIds = trips.map((trip) => trip.trailIds).flat();

      isInTrip = listingIds.includes(id);
    }

    return isInTrip;
  }, [trips]);

  // ----------------------- render -----------------------

  return (
    <div
      className="flex py-7 px-2 border-b cursor-pointer 
    hover:opacity-70 hover:shadow-lg hover:bg-gray-200 hover:rounded-xl pr-4 transition duration-200 ease-out 
    first:border-t "
      onClick={handleClick}
    >
      <div className="relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0">
        <Image
          src={img}
          alt={img}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-2xl"
        />
      </div>

      <div className="flex flex-col flex-grow pl-5">
        <div className="flex justify-between">
          <h4 className="text-lg">{title}</h4>
          <div className="flex relative">
            {abilityToAddToTrips && !price ? (
              !isInTrip ? (
                <div
                  className="mr-1 mt-[2px] cursor-pointer text-slate-700 transition ease-in-out hover:text-green-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdownTripsMenu((prev) => !prev);
                  }}
                >
                  <BsCalendar2Plus size={19} />
                </div>
              ) : (
                <div
                  className="mr-1 mt-[2px] cursor-pointer text-rose-400
            hover:text-green-400 transition ease-in-out"
                  onClick={(e) => {
                    e.stopPropagation();
                    let tripId;
                    if (page === "Attractions") {
                      tripId = trips.find((trip) =>
                        trip.attractionIds.includes(id)
                      ).id;
                    } else if (page === "Trails") {
                      tripId = trips.find((trip) =>
                        trip.trailIds.includes(id)
                      ).id;
                    }
                    deleteFromTrip(id, tripId, page);
                  }}
                >
                  <BsCalendarXFill size={19} />
                </div>
              )
            ) : null}

            <HeartButton
              listingId={id}
              currentUser={currentUser}
              refetchUser={refetchUser}
              page={page}
            />
            {showDropdownTripsMenu && !isInTrip ? (
              <div className="absolute top-0 right-12 bg-green-700 p-1 rounded-md mt-1 z-50 text-sm w-56">
                {/* dodaj nową wycieczkę */}
                <div
                  className="flex flex-row justify-center items-center cursor-pointer p-1 text-white hover:bg-white hover:text-red-400 hover:rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToTrips();
                    setShowDropdownTripsMenu((prev) => !prev);
                  }}
                >
                  <AiOutlinePlusCircle size={18} className="mr-1" />
                  <span>Dodaj nową wycieczkę</span>
                </div>
                {/* pokaż istniejącej wycieczki */}
                {trips?.map((trip, index) => (
                  <div key={index}>
                    <hr className="mb-1" />
                    <div
                      className="flex flex-row cursor-pointer p-1 text-white hover:bg-white hover:text-red-400 hover:rounded-md items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToExistingTrip(id, trip.id, page);
                        setShowDropdownTripsMenu((prev) => !prev);
                      }}
                    >
                      <span>
                        {trip.name ? trip.name : `Wycieczka nr.${index + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-b w-10 pt-2" />

        <div className="flex items-center justify-end mb-2">
          <p className="pt-2 text-sm text-gray-500 flex-grow">{description}</p>
          <button
            className="flex items-center justify-center bg-green-400 border-2 border-green-400 text-white p-1 rounded-2xl cursor-pointer hover:bg-white hover:text-green-400 hover:border-gray-400 transition ease-in-out duration-300"
            onClick={(e) => {
              e.stopPropagation();
              getListingForMap(id);
            }}
          >
            <span className="text-xl ">Mapa|</span>
            <BsFillPinMapFill size={20} />
          </button>
        </div>

        {/* ----------------------- kategoria listingu ----------------------- */}
        <hr />
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-row items-center gap-4">
            <div>
              <Icon size={40} className="text-neutral-600" />
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{CategoryLabel}</div>
              <div className="text-neutral-500 font-light">
                {CategoryDescription}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="flex justify-between items-end pt-5">
          <p className="flex items-center text-lg font-semibold pb-2 lg:text-2xl">
            <StarIcon className="h-8 text-red-400" />
            {star !== "0" ? star : "Brak ocen"}
          </p>

          <p className="text-lg font-semibold pb-2 lg:text-2xl">
            {price
              ? price + `${page === "Listings" ? " zł/noc" : " zł/osoba"}`
              : "Bezpłatna"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
