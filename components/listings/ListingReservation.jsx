import Calendar from "../inputs/Calendar";
import Button from "../modals/Button";

const ListingReservation = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  return (
    <div
      className="
      bg-white 
        rounded-xl 
        border-[1px]
      border-neutral-200 
        overflow-hidden
      "
    >
      <div
        className="
      flex flex-row items-center gap-1 p-4"
      >
        <div className="text-2xl font-semibold">{price} zł</div>
        <div className="font-light text-neutral-400 text-2xl">/noc</div>
      </div>
      <hr />
      <div className="h-full">
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value) => onChangeDate(value.selection)}
        />
      </div>
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Rezerwuj" onClick={onSubmit} />
      </div>
      <hr />
      <div
        className="
          p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg
        "
      >
        <div>Razem: </div>
        <div className="underline">{totalPrice} zł</div>
      </div>
    </div>
  );
};

export default ListingReservation;
