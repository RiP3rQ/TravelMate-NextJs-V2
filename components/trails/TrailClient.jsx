import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { attractionTypes } from "../../src/pages/index";
import axios from "axios";
import ReviewCard from "../reviews/ReviewCard";
import useGalleryModal from "../../hooks/useGalleryModal";
import ListingHead from "../listings/ListingHead";
import TrailInfo from "./TrailInfo";
import MyMap from "../MyMap";

const TrailClient = ({ listing, currentUser, refetchUser }) => {
  // ----------------------- router
  const path = usePathname();
  const trailId = path?.substring(8);

  // ----------------------- galeria
  const galleryModal = useGalleryModal();

  // ----------------------- display with types from index.js applies to listing
  const category = useMemo(() => {
    return attractionTypes.find((item) => item.label === listing.category);
  }, [listing.category]);

  // ----------------------- get Reviews for listing
  const [trailReviews, setTrailReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/trails/getTrailsReviewsById`,
      {
        trailId: trailId,
      }
    );
    if (res.data.message === "Reviews not found!") {
      console.log("Reviews not found!");
      return;
    } else {
      setTrailReviews(res.data);
    }
  };

  useMemo(() => {
    if (trailId === undefined || trailId === null) return;
    fetchReviews();
  }, [trailId]);

  // ----------------------- handle open gallery modal
  const imageList = [];

  const handleOpenGalleryModal = () => {
    // add listing image to the imageList
    imageList.push(listing.imageSrc);
    // Loop through the reviews and add non-empty imageSrc values to the imageList
    for (let i = 0; i < trailReviews.length; i++) {
      const item = trailReviews[i];
      if (item.imageSrc !== null && item.imageSrc !== "") {
        imageList.push(item.imageSrc);
      }
    }

    galleryModal.setImages(imageList);
    galleryModal.onOpen();
  };

  console.log(listing);

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
          {/* Tytuł / Gwiazdki / zdjęcie */}
          <ListingHead
            title={listing?.title}
            imageSrc={listing?.imageSrc}
            description={listing?.description}
            id={listing?.id}
            currentUser={currentUser}
            refetchUser={refetchUser}
            star={listing?.star}
            page="Listings"
            reviews={trailReviews}
          />
          {/* środkowy div podzielony na 2 części */}
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <TrailInfo user={listing.user} category={category} />
            {/* prawa część - rezerwacja */}
            <div className="order-first md:order-last md:col-span-3">
              <MyMap
                currentUser={currentUser}
                refetchUser={refetchUser}
                page="Trails"
                singleTrail={listing}
              />
            </div>
          </div>
          <hr />
          {/* dolna część - recenzje */}
          {trailReviews.length > 0 ? (
            <>
              <div className="text-2xl font-semibold flex items-center justify-between ">
                <h2>
                  Recenzje{" "}
                  {trailReviews.length > 0 && "[" + trailReviews.length + "]"}
                </h2>
                <div
                  className="py-1 px-3 border-2 border-gray-400 bg-green-400 rounded-xl flex items-center cursor-pointer"
                  onClick={handleOpenGalleryModal}
                >
                  Galeria
                </div>
              </div>

              <hr />
            </>
          ) : (
            <h2 className="text-2xl font-semibold">Recenzje</h2>
          )}

          <div className="grid gap-10 grid-cols-2 w-full mb-8">
            {trailReviews.length > 0 ? (
              trailReviews.map((review) => (
                <div
                  className={`w-full h-max border-2 border-gray-400 rounded-xl p-4 col-span-1 ${
                    review.imageSrc !== "" && "col-span-2"
                  }`}
                  key={review.id}
                >
                  <ReviewCard key={review.id} review={review} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full col-span-2 mb-10">
                <p className="text-3xl font-bold">Brak Recenzji</p>
                <p className="text-lg text-gray-400">
                  Wygląda na to, że nikt jeszcze nie dodał recenzji do tej
                  pozycji.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailClient;
