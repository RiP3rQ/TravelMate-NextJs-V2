import Image from "next/image";
import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const MapInfoCard = ({
  img,
  location,
  title,
  description,
  star,
  price,
  total,
}) => {
  return (
    <div className="py-2 px-2 relative grid grid-cols-7 bg-slate-200 rounded-xl">
      {/* LEFT */}
      <div className="flex flex-col col-span-5 relative p-1">
        <div className="flex justify-between">
          <p className="text-[10px] text-gray-500">{location}</p>
          <HeartIcon className="h-7 cursor-pointer absolute top-0 right-2" />
        </div>

        <div className="border-b w-40 pt-1 -mt-2" />

        <div className="flex">
          <h4 className="text-base text-gray-900 font-bold flex-grow">
            {title}
          </h4>
          <p className="flex items-center justify-between pr-1">
            <StarIcon className="h-4 text-red-400" />
            <span className="text-sm font-bold">{star}</span>
          </p>
        </div>

        <div className="border-b w-40 pt-1" />

        <p className="pt-1 text-xs text-gray-500 flex-grow">{description}</p>

        <div className="flex justify-between items-end pt-5">
          <button className="bg-green-800 py-4 px-7 rounded-full text-sm font-bold text-white">
            Rezerwuj
          </button>
          <div className=" -mt-2">
            <p className="text-lg font-semibold lg:text-2xl">{price}</p>
            <p className="text-right font-extralight text-sm">{total}</p>
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
