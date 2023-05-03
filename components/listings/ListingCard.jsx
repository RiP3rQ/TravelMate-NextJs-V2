import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import Button from "../modals/Button";
import HeartButton from "../HeartButton";
import { BsCalendar2Plus, BsCalendarXFill } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";

const ListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  refetchUser,
  page,
  abilityToAddToTrips,
  addToTrips,
  trips,
  addToExistingTrip,
  deleteFromTrip,
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [disabled, onAction, actionId]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  // Możlwiość dodania do wycieczki
  const [showDropdownTripsMenu, setShowDropdownTripsMenu] = useState(false);

  const handleDropdownTripsMenu = useCallback(
    async (e) => {
      e.stopPropagation();
      setShowDropdownTripsMenu((prev) => !prev);
    },
    [currentUser]
  );

  // Sprawdzenie czy dany listing jest już w wycieczce
  const isInTrip = useMemo(() => {
    if (!trips) {
      return false;
    }

    let isInTrip;

    if (page === "Listings") {
      const reservationIds = trips.map((trip) => trip.reservationIds).flat();

      isInTrip = reservationIds.includes(reservation?.id);
    } else if (page === "Attractions") {
      const listingIds = trips.map((trip) => trip.attractionIds).flat();

      isInTrip = listingIds.includes(data?.id);
    }

    return isInTrip;
  }, [trips]);

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group z-10"
    >
      <div className="flex flex-col w-full relative">
        {/* obrazek + like button*/}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={data.imageSrc}
            alt="Listing"
          />
          <div className="absolute top-3 right-3">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
              refetchUser={refetchUser}
              page={page}
            />
          </div>
        </div>
        {/* tekst */}
        <div className="absolute bottom-0 z-10 p-2 bg-green-500 w-full rounded-b-xl">
          <div className="font-semibold text-lg">{data.title}</div>
          <div className="font-light text-neutral-500">
            {reservationDate || data.category}
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="font-semibold">
              {price ? `${price} zł` : "Darmowa"}
            </div>
            {!reservation && price && <div className="font-light">/noc</div>}
          </div>
        </div>
        {
          // dodaj do wycieczki
          abilityToAddToTrips && !isInTrip ? (
            <>
              <div
                className="absolute top-10 right-3 cursor-pointer border border-transparent text-slate-200 transition ease-in-out hover:text-green-400"
                onClick={handleDropdownTripsMenu}
              >
                <BsCalendar2Plus size={24} />
              </div>
              {showDropdownTripsMenu && !isInTrip && (
                <div className="absolute top-9 right-12 bg-green-700 p-1 rounded-md mt-1 z-50 text-sm">
                  {/* dodaj nową wycieczkę */}
                  <div
                    className="flex flex-row cursor-pointer p-1 text-white hover:bg-white hover:text-red-400 hover:rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToTrips(reservation.id);
                      setShowDropdownTripsMenu((prev) => !prev);
                    }}
                  >
                    <AiOutlinePlusCircle size={18} className="mr-1" />
                    <span>Dodaj nową wycieczkę</span>
                  </div>
                  {/* pokaż istniejącej wycieczki */}
                  {trips?.map((trip, index) => (
                    <div key={index}>
                      <hr className="mb-1" />
                      <div
                        className="flex flex-row cursor-pointer p-1 text-white hover:bg-white hover:text-red-400 hover:rounded-md items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (page === "Listings") {
                            addToExistingTrip(reservation.id, trip.id, page);
                          } else if (page === "Attractions") {
                            addToExistingTrip(data.id, trip.id, page);
                          }

                          setShowDropdownTripsMenu((prev) => !prev);
                        }}
                      >
                        <span>
                          {trip.name ? trip.name : `Wycieczka nr.${index + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null
        }
        {
          // usuń z wycieczki
          abilityToAddToTrips && isInTrip ? (
            <div
              className="absolute top-10 right-3 cursor-pointer text-rose-400 border border-white rounded-md bg-white hover:bg-transparent 
            hover:text-green-400 hover:border-transparent transition ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                if (page === "Listings") {
                  const tripId = trips.find((trip) =>
                    trip.reservationIds.includes(reservation.id)
                  ).id;
                  deleteFromTrip(reservation.id, tripId, page);
                } else if (page === "Attractions") {
                  const tripId = trips.find((trip) =>
                    trip.attractionIds.includes(data.id)
                  ).id;
                  deleteFromTrip(data.id, tripId, page);
                }
              }}
            >
              <BsCalendarXFill size={24} />
            </div>
          ) : null
        }
      </div>
      {onAction && actionLabel && (
        <div className="mt-2">
          <Button
            disabled={disabled}
            label={actionLabel}
            onClick={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default ListingCard;
