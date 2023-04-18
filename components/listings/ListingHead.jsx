import Heading from "../modals/Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";
import { StarIcon } from "@heroicons/react/24/solid";
import useReviewModal from "../../hooks/useReviewModal";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

const ListingHead = ({
  title,
  description,
  imageSrc,
  id,
  currentUser,
  refetchUser,
  star,
  page,
  reviews,
}) => {
  const reviewModal = useReviewModal();

  // open review modal
  const onReview = useCallback(() => {
    if (!currentUser) {
      return toast.error("Musisz się zalogować, aby móc ocenić miejsce");
    }

    console.log("review modal open");
    // open rent modal
    reviewModal.setPage(page);
    reviewModal.setItemId(id);
    reviewModal.onOpen();
  }, [currentUser, reviewModal]);

  if (reviews.length > 0) {
    const sum = reviews.reduce((acc, review) => {
      let rating = review.star;
      return acc + parseFloat(rating);
    }, 0);
    star = (sum / reviews.length).toFixed(1);
  }

  return (
    <>
      <div className=" flex items-center justify-between gap-9">
        <Heading title={title} subtitle={description} />
        <div className="w-80">
          {star === "0" ? (
            <div
              className="flex flex-col items-center justify-center mt-2 cursor-pointer bg-slate-200 rounded-xl py-1"
              onClick={onReview}
            >
              <span className="text-3xl font-bold text-green-500">
                Brak ocen
              </span>
              <span className="text-gray-400 hover:underline">
                {" "}
                Oceń to miejsce
              </span>
            </div>
          ) : (
            <div
              className="flex items-end flex-col cursor-pointer"
              onClick={onReview}
            >
              <div className="flex items-center justify-end">
                <StarIcon className="h-8 text-red-400" />
                <span className="text-3xl font-bold">{star}</span>
              </div>
              <span className="text-gray-400 hover:underline">
                {" "}
                Dodaj recenzję
              </span>
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
            page={page}
          />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
