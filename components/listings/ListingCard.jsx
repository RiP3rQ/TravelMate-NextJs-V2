import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useCallback, useMemo } from "react";
import Button from "../modals/Button";
import HeartButton from "../HeartButton";

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

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col w-full relative">
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
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
