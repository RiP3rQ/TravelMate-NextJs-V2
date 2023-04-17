import Image from "next/image";
import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import HeartButton from "./HeartButton";
import { useRouter } from "next/navigation";

const InfoCard = ({
  img,
  id,
  title,
  description,
  price,
  star,
  currentUser,
  refetchUser,
}) => {
  const router = useRouter();

  return (
    <div
      className="flex py-7 px-2 border-b cursor-pointer 
    hover:opacity-70 hover:shadow-lg hover:bg-gray-200 hover:rounded-xl pr-4 transition duration-200 ease-out 
    first:border-t "
      onClick={() => router.push(`/listings/${id}`)}
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
          />
        </div>

        <div className="border-b w-10 pt-2" />

        <p className="pt-2 text-sm text-gray-500 flex-grow">{description}</p>

        <div className="flex justify-between items-end pt-5">
          <p className="flex items-center text-lg font-semibold pb-2 lg:text-2xl">
            <StarIcon className="h-8 text-red-400" />
            {star !== "0" ? star : "Brak ocen"}
          </p>

          <p className="text-lg font-semibold pb-2 lg:text-2xl">{price} zł</p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
