import React from "react";
import Button from "../modals/Button";

const AttractionBuyTicket = ({ paid, price }) => {
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
      <div className="flex flex-row items-center justify-center w-full">
        {paid ? (
          <div className="w-full mt-3">
            <div className="text-5xl font-semibold text-center">{price} zł</div>
            <div className="font-light text-neutral-400 text-2xl text-center pb-3">
              /osoba
            </div>
            <div className="w-full">
              <Button label="Kup bilet" onClick={() => {}} />
            </div>
          </div>
        ) : (
          <div className="text-2xl font-semibold p-5">
            Atrakcja jest bezpłatna
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionBuyTicket;
