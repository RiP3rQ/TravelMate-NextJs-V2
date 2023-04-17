import Heading from "../modals/Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";
import { StarIcon } from "@heroicons/react/24/solid";

const ListingHead = ({
  title,
  description,
  imageSrc,
  id,
  currentUser,
  refetchUser,
  star,
}) => {
  return (
    <>
      <div className=" flex items-center justify-between gap-9">
        <Heading title={title} subtitle={description} />
        <div className="w-80">
          {star === "0" ? (
            <div className="flex flex-col items-center justify-center mt-2 cursor-pointer bg-slate-200 rounded-xl py-1">
              <span className="text-3xl font-bold text-red-400">Brak ocen</span>
              <span className="text-gray-400 hover:underline">
                {" "}
                Oceń to miejsce
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <StarIcon className="h-8 text-red-400" />
              <span className="text-3xl font-bold">{star}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div className="absolute top-5 right-5">
          <HeartButton
            listingId={id}
            currentUser={currentUser}
            refetchUser={refetchUser}
          />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
