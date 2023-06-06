import React from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const SmallCard = ({ routerId, img, title, star }) => {
  const router = useRouter();
  return (
    <div
      className="flex items-center m-2 mt-5 space-x-4 rounded-xl cursor-pointer
    hover:bg-gray-100 hover:scale-105 transition transform duration-200 ease-out
    bg-gray-200
    "
      onClick={() => router.push(`/attractions/${routerId}`)}
    >
      {/* LEFT */}
      <div className="relative h-16 w-24">
        <Image src={img} alt={img} fill className="rounded-lg" />
      </div>

      {/* RIGHT */}
      <div className="relative w-full">
        <h1 className="text-2xl font-bold text-gray-700 text-center capitalize">
          {title}
        </h1>
        <p className="flex items-center justify-center text-lg font-semibold pb-2 ">
          <StarIcon className="h-8 text-red-400" />
          <span className="text-gray-500 ">
            {star !== "0" ? star : "Brak ocen"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SmallCard;
