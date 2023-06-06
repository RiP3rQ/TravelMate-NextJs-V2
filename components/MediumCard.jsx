import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const MediumCard = ({ img, title, star, routerId, page }) => {
  const router = useRouter();
  return (
    <div
      className="cursor-pointer hover:scale-105 transition transform duration-300 ease-out"
      onClick={() => {
        if (page === "listings") {
          router.push(`/listings/${routerId}`);
        } else if (page === "trails") {
          router.push(`/trails/${routerId}`);
        }
      }}
    >
      <div className="relative h-64 w-80">
        <Image src={img} alt={title} fill className="rounded-xl" />
        <div className="absolute top-2 right-2 flex justify-center items-center bg-green-400/80 rounded-xl  px-2">
          <StarIcon className="h-8 text-red-400" />
          <span className="text-gray-700 font-bold">
            {star !== "0" ? star : "Brak ocen"}
          </span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-700 text-center capitalize">
        {title}
      </h1>
    </div>
  );
};

export default MediumCard;
