import { useCallback, useEffect, useMemo, useState } from "react";
import { attractionTypes } from "@/pages";
import ListingHead from "../listings/ListingHead";
import ListingInfo from "../listings/ListingInfo";
import AttractionBuyTicket from "./AttractionBuyTicket";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import ReviewCard from "../reviews/ReviewCard";
import useGalleryModal from "../../hooks/useGalleryModal";
import { toast } from "react-hot-toast";

const AttractionClient = ({ attraction, currentUser, refetchUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  // ----------------------- router
  const path = usePathname();
  const attractionId = path?.substring(13);
  const router = useRouter();

  // ----------------------- galeria
  const galleryModal = useGalleryModal();

  // ----------------------- display with types from index.js applies to listing
  const category = useMemo(() => {
    return attractionTypes.find((item) => item.label === attraction.category);
  }, [attraction.category]);

  // ----------------------- get Reviews for attraction
  const [attractionReviews, setAttractionReviews] = useState([]);
  const fetchReviews = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/attractions/getAttractionReviewsById`,
      {
        attractionId: attractionId,
      }
    );
    if (res.data.message === "Reviews not found!") {
      console.log("Reviews not found!");
      return;
    } else {
      setAttractionReviews(res.data);
    }
  };

  useMemo(() => {
    if (attractionId === undefined || attractionId === null) return;
    fetchReviews();
  }, [attractionId]);

  // ----------------------- handle open gallery modal
  const imageList = [];

  const handleOpenGalleryModal = () => {
    // add listing image to the imageList
    imageList.push(attraction.imageSrc);
    // Loop through the reviews and add non-empty imageSrc values to the imageList
    for (let i = 0; i < attractionReviews.length; i++) {
      const item = attractionReviews[i];
      if (item.imageSrc !== null && item.imageSrc !== "") {
        imageList.push(item.imageSrc);
      }
    }

    galleryModal.setImages(imageList);
    galleryModal.onOpen();
  };

  // ----------------------- toast
  useEffect(() => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-[400px] w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative`}
        >
          <div className="flex-1 w-0 p-4">
            <h1 className="font-bold text-2xl text-center">
              Lista przydatnych przedmiotów:
            </h1>
            {category?.notifications?.map((item) => (
              <p
                key={item}
                className="font-thin text-gray-400 text-base text-center"
              >
                - {item}
              </p>
            ))}
          </div>

          <button
            onClick={() => toast.dismiss()}
            className="absolute -top-2 -right-2 bg-gray-400 text-green-200 px-2 rounded-lg hover:text-white hover:bg-red-400"
          >
            X
          </button>
        </div>
      ),
      {
        id: "custom-id-1",
        duration: 10000,
        position: "bottom-right",
      }
    );
  }, []);

  // ----------------------- buy ticket function
  const onBuyTicket = useCallback(async () => {
    if (!currentUser) {
      return router.push("/login");
    }

    if (!attraction?.paid) return toast.error("Atrakcja bezpłatna!");

    setIsLoading(true);

    axios
      .post("/api/reservations/buyTicket", {
        price: attraction?.price,
        attractionId: attraction?.id,
        currentUserId: currentUser.id,
      })
      .then(() => {
        toast.success("Kupiono bilet!");
        // w przyszłości zrobić przekierowanie na strone planera podróży
        // z możliwościa wybrania atrakcji itp.
      })
      .catch(() => {
        toast.error("Coś poszło nie tak!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser, attraction]);

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
          {/* Tytuł / Gwiazdki / zdjęcie */}
          <ListingHead
            title={attraction?.title}
            imageSrc={attraction?.imageSrc}
            description={attraction?.description}
            id={attraction?.id}
            currentUser={currentUser}
            refetchUser={refetchUser}
            star={attraction?.star}
            page="Attractions"
            reviews={attractionReviews}
          />
          {/* środkowy div podzielony na 2 części */}
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6 mb-6">
            {/* lewa część - kto dodał / kategorie / mapa*/}
            <ListingInfo
              user={attraction?.user}
              category={category}
              description={attraction?.description}
              long={attraction?.long}
              lat={attraction?.lat}
            />
            {/* prawa część - kupno biletu / informacja o darmowej atrakcji */}
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <AttractionBuyTicket
                paid={attraction?.paid}
                price={attraction?.price}
                onSubmit={onBuyTicket}
                disabled={isLoading}
              />
            </div>
          </div>
          <hr />
          {/* dolna część - recenzje */}
          {attractionReviews.length > 0 ? (
            <>
              <div className="text-2xl font-semibold flex items-center justify-between ">
                <h2>
                  Recenzje{" "}
                  {attractionReviews.length > 0 &&
                    "[" + attractionReviews.length + "]"}
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
            {attractionReviews.length > 0 ? (
              attractionReviews.map((review) => (
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

export default AttractionClient;
