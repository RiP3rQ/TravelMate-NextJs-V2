import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { types } from "../../src/pages/index";
import ListingHead from "./ListingHead";
import ListingInfo from "./ListingInfo";
import ListingReservation from "./ListingReservation";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReviewCard from "../reviews/ReviewCard";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingClient = ({
  reservations = [],
  listing,
  currentUser,
  refetchUser,
}) => {
  // ----------------------- router
  const path = usePathname();
  const listingId = path?.substring(10);

  // ----------------------- disabled dates using date-fns
  const disabledDates = useMemo(() => {
    let dates = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  // ----------------------- states + date range price calculation
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  // ----------------------- display with types from index.js applies to listing
  const category = useMemo(() => {
    return types.find((item) => item.label === listing.category);
  }, [listing.category]);

  // ----------------------- get Reviews for listing
  const [listingReviews, setListingReviews] = useState([]);
  const fetchReviews = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/listings/getListingReviewsById`,
      {
        listingId: listingId,
      }
    );
    if (res.data.message === "Reviews not found!") {
      console.log("Reviews not found!");
      return;
    } else {
      setListingReviews(res.data);
    }
  };

  useMemo(() => {
    if (listingId === undefined || listingId === null) return;
    fetchReviews();
  }, [listingId]);

  console.log(listingReviews);

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
            reviews={listingReviews}
          />
          {/* środkowy div podzielony na 2 części */}
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            {/* lewa część - kto dodał / kategorie / mapa*/}
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
              long={listing.long}
              lat={listing.lat}
            />
            {/* prawa część - rezerwacja */}
            <div className="order-first md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={() => {
                  toast.success("Tu w przyszłość będzie rezerwacja");
                }}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
          <hr />
          {/* dolna część - recenzje */}

          <h2 className="text-2xl font-semibold">
            Recenzje{" "}
            {listingReviews.length > 0 && "[" + listingReviews.length + "]"}
          </h2>
          <div className="grid gap-10 grid-cols-2 w-full mb-8">
            {listingReviews.length > 0 ? (
              listingReviews.map((review) => (
                <div
                  className={`w-full h-max border-2 border-gray-400 rounded-xl p-4 col-span-1 ${
                    review.imageSrc !== "" && "col-span-2"
                  }`}
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

export default ListingClient;
