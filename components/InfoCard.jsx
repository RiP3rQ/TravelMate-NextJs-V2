import Image from "next/image";
import React, { useMemo } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import HeartButton from "./HeartButton";
import { useRouter } from "next/navigation";
import { attractionTypes, types } from "@/pages";
import { BsFillPinMapFill } from "react-icons/bs";

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
      return attractionTypes.find((item) => item.label === category);
    }
  }, [category, page]);

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
          <HeartButton
            listingId={id}
            currentUser={currentUser}
            refetchUser={refetchUser}
            page={page}
          />
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
