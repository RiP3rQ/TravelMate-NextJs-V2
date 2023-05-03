import React, { useState } from "react";
import Heading from "../modals/Heading";
import Image from "next/image";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import AddTrailMap from "../trails/AddTrailMap";
import { toast } from "react-hot-toast";
import axios from "axios";

const TripClient = ({ tripData, refetchTripData }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = async () => {
    if (savedItems.length > 0) {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/saveTripItems`, {
          tripId: tripData.id,
          newItems: savedItems,
        })
        .then((res) => {
          setSavedItems([]);
          toast.success("Pomyślnie dodano nowy element do listy");
          refetchTripData(tripData.id);
        })
        .catch((err) => {
          toast.error(
            "Wystąpił błąd podczas dodawania nowego elementu do listy"
          );
        });
    } else {
      toast.error("Brak nowych elementów do dodania");
    }
  };

  const handleDeleteSavedItem = async (item) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/deleteTripSavedItem`, {
        tripId: tripData.id,
        item: item,
      })
      .then((res) => {
        toast.success("Sukcess! Odśwież stronę, aby zobaczyć zmiany");
      })
      .catch((err) => {
        toast.error("Wystąpił błąd podczas usuwania elementu z bazy danych");
      });
  };

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
          {tripData.reservations.length > 0 ? (
            <div>
              <Heading
                title="Twoje rezerwacje"
                subtitle="Lista zarezerwowanych noclegów dla tej wycieczki"
              />
              <hr className="mb-2" />
              {tripData?.reservations?.map((reservation, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-32 w-full my-2 space-x-2"
                >
                  <div className="w-1/2 mx-auto h-full relative">
                    <Image
                      src={reservation.listing.imageSrc}
                      alt={reservation.listing.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-500">
                      {reservation.listing.title}
                    </p>
                    <hr />
                    <div className="text-sm text-gray-300 mb-2">
                      <span>
                        Liczba gości: {reservation.listing.guestCount} |{" "}
                      </span>
                      <span>
                        Liczba pokoi: {reservation.listing.roomCount} |{" "}
                      </span>
                      <span>
                        Liczba łazienek: {reservation.listing.bathroomCount}
                      </span>
                    </div>
                    <div className="text-lg text-gray-400">
                      <p>
                        Data przyjazdu:{" "}
                        {new Date(reservation.startDate).toLocaleDateString()}
                        <span> | </span>
                        Data wyjazdu:{" "}
                        {new Date(reservation.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-lg text-gray-400">
                      <p>Całościowa cena: {reservation.totalPrice} zł</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-6 mt-5">
          {tripData?.attractions?.length > 0 ? (
            <div>
              <Heading
                title="Zaplanowane atrakcje"
                subtitle="Lista zaplanowanych atrakcji dla tej wycieczki"
              />
              <hr className="mb-2" />
              {tripData.attractions.map((attraction, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-32 w-full my-2 space-x-2"
                >
                  <div className="w-1/2 mx-auto h-full relative">
                    <Image
                      src={attraction.imageSrc}
                      alt={attraction.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-center flex-col">
                    <p className="text-2xl font-bold text-gray-500">
                      {attraction.title}
                    </p>
                    <hr />
                    <div className="text-lg text-gray-300 mb-2 flex items-center justify-between gap-10">
                      {attraction.paid ? (
                        <>
                          <div className="text-red-500">Atrakcja płatna</div>
                          <div className="text-red-500">
                            {attraction.price} zł
                          </div>
                        </>
                      ) : (
                        <span className="text-green-500">Atrakcja darmowa</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-6 mt-5">
          {tripData?.trails?.length > 0 ? (
            <div>
              <Heading
                title="Zaplanowane szlaki"
                subtitle="Lista zaplanowanych szlaków dla tej wycieczki"
              />
              <hr className="mb-2" />
              {tripData.trails.map((trail, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-48 w-full my-2 space-x-2"
                >
                  <div className="w-1/2 mx-auto h-full relative">
                    <Image
                      src={trail.imageSrc}
                      alt={trail.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                    <p className="absolute bottom-0 bg-slate-400/80 text-sm w-full text-center font-bold text-white rounded-b-lg">
                      {trail.title}
                    </p>
                  </div>
                  <div className="w-5/6 h-full">
                    <AddTrailMap trailData={trail.locations} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 mt-5 min-h-screen">
          <div>
            <Heading
              title="Lista przedmiotów do zabrania"
              subtitle="Lista przedmiotów, które powinieneś zabrać na tą wycieczkę"
            />
            <hr />
            <div className="text-sm text-center w-full text-red-500">
              Niezapisane przedmioty zostaną usunięte po zamknięciu strony!
            </div>
            <hr className="mb-2" />
            <div className="w-full">
              <div
                className="w-1/2 mx-auto bg-green-400 text-white rounded-xl px-4 py-2 text-2xl flex items-center justify-center cursor-pointer z-10"
                onClick={() => {
                  if (!addingItem) {
                    setAddingItem(true);
                  }
                }}
              >
                {addingItem ? (
                  <div className="w-full">
                    <form>
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="w-full rounded-lg px-2 py-1 bg-slate-400/80 text-white text-center focus:outline-none"
                      />
                      <div className="w-full flex items-center justify-center mt-1">
                        <button
                          type="submit"
                          className="bg-green-800 text-white rounded-lg px-2 py-1 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            if (newItem === "")
                              return toast.error(
                                "Nie możesz dodać pustego przedmiotu!"
                              );
                            setSavedItems([...savedItems, newItem]);
                            setNewItem("");
                            setAddingItem(false);
                          }}
                        >
                          DODAJ
                        </button>
                        <button
                          className="bg-red-400 text-white rounded-lg px-2 py-1 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setNewItem("");
                            setAddingItem(false);
                          }}
                        >
                          ANULUJ
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <AiOutlinePlusCircle className="mr-2 mt-1" />
                    Dodaj nowy przedmiot
                  </>
                )}
              </div>
              <hr className="my-4" />
              {savedItems.length > 0 ? (
                <div className="w-full">
                  <Heading title="Lista nowych przedmiotów" />
                  {savedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full px-4 py-2 bg-slate-400/80 rounded-lg mb-2 text-2xl  text-white"
                    >
                      <p>- {item}</p>
                      <button
                        className="bg-red-400 rounded-lg px-2 py-1 "
                        onClick={() => {
                          const newItems = savedItems.filter(
                            (savedItem) => savedItem !== item
                          );
                          setSavedItems(newItems);
                        }}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  ))}
                  <hr />
                  <div className="w-full flex items-center justify-center mt-2">
                    <button
                      className="bg-green-400 text-white rounded-lg px-2 py-1 w-full"
                      onClick={handleAddItem}
                    >
                      ZAPISZ
                    </button>
                  </div>
                </div>
              ) : null}

              {tripData?.savedItems?.length > 0 ? (
                <div className="w-full">
                  <Heading title="Lista zapisanych przedmiotów" />
                  {tripData.savedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between w-full px-4 py-2 bg-slate-400/80 rounded-lg mb-2 text-2xl  text-white"
                    >
                      <p>- {item}</p>
                      <button
                        className="bg-red-400 rounded-lg px-2 py-1 "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSavedItem(item);
                        }}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripClient;
