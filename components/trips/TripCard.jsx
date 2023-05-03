import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillGearFill } from "react-icons/bs";

const TripCard = ({ trip, index, handleDelete, handleChangeTripName }) => {
  const [changeNameMenuOpen, setChangeNameMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  return (
    <div className=" relative" key={index}>
      <div
        key={trip.id}
        onClick={() => router.push(`/trips/${trip.id}`)}
        className={`w-full h-80 bg-green-400 flex items-center justify-center cursor-pointer text-white font-bold text-3xl rounded-xl border-4 border-transparent
hover:bg-white hover:text-green-400 hover:border-green-400 hover:animate-pulse transition duration-300 ease-in-out z-10`}
      >
        {trip.name ? trip.name : `Wycieczka nr.${index + 1}`}
      </div>
      <div
        className="absolute -top-4 -right-3 bg-red-400 py-2 px-3 rounded-xl text-white text-2xl z-20 cursor-pointer
  border border-transparent hover:text-green-400 hover:bg-white hover:border-green-400"
        onClick={() => {
          handleDelete(trip.id);
        }}
      >
        <AiOutlineClose />
      </div>
      <div
        className="absolute top-8 -right-3 bg-red-400 py-2 px-3 rounded-xl text-white text-2xl z-20 cursor-pointer
  border border-transparent hover:text-green-400 hover:bg-white hover:border-green-400"
        onClick={() => {
          setChangeNameMenuOpen((prev) => !prev);
        }}
      >
        <BsFillGearFill />
      </div>
      {changeNameMenuOpen ? (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white w-96 h-96 rounded-xl flex flex-col items-center justify-center">
            <div className="text-3xl font-bold mb-4">Zmień nazwę wycieczki</div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-3/4 h-12 border-2 border-gray-500 rounded-xl px-4 text-xl"
            />
            <div className="mt-4 flex items-center justify-center">
              <div
                className="bg-green-500 px-4 py-2 rounded-xl text-white text-xl cursor-pointer
          hover:bg-white hover:text-green-500 hover:border-green-500 hover:animate-pulse transition duration-300 ease-in-out"
                onClick={() => {
                  handleChangeTripName(trip.id, newName);
                  setChangeNameMenuOpen(false);
                }}
              >
                Zapisz
              </div>
              <div
                className="bg-red-500 px-4 py-2 rounded-xl text-white text-xl cursor-pointer ml-4
          hover:bg-white hover:text-red-500 hover:border-red-500 hover:animate-pulse transition duration-300 ease-in-out"
                onClick={() => {
                  setChangeNameMenuOpen(false);
                }}
              >
                Anuluj
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TripCard;
