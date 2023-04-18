import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div>
      {/* TOP PART */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">Dodane przez:</h1>
        <div className="flex flex-row gap-1 items-end">
          <h1 className="text-xl font-bold">{review?.user.name}</h1>
          <h1 className="text-xs text-gray-400 mb-1">
            {"<" + review?.user.email + ">"}
          </h1>
          <Image
            className="rounded-full"
            src={review?.user?.image}
            width={30}
            height={30}
            alt="Avatar"
          />
        </div>
      </div>
      {/* STARS */}
      <div className="flex items-center justify-center">
        <h2 className="text-lg text-gray-400 pr-2">Ocena: </h2>
        <StarIcon className="h-5 text-red-400" />
        <span className="text-lg text-gray-400 pl-1">{review.star}</span>
      </div>
      <hr />
      <p className="text-lg">
        <span className="font-bold">Tytuł:</span> {review.title}
      </p>
      <p className="text-lg">
        <span className="font-bold">Treść:</span> {review.description}
      </p>

      {review.imageSrc && (
        <>
          <hr />
          <div className="w-full mt-2">
            <div className="max-w-4xl h-[600px] relative mx-auto">
              <Image
                src={review.imageSrc}
                alt={review.title}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCard;
