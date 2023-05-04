import React, { useMemo, useState } from "react";
import Heading from "../modals/Heading";
import Image from "next/image";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import AddTrailMap from "../trails/AddTrailMap";
import { toast } from "react-hot-toast";
import axios from "axios";
import { BsFillPinMapFill } from "react-icons/bs";

const TripClient = ({ tripData = [], refetchTripData, tripId }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [endPoint, setEndPoint] = useState({ lat: 0, lng: 0 });

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
        refetchTripData(tripId);
        toast.success("Sukcess! Rekord został usunięty z bazy danych");
      })
      .catch((err) => {
        toast.error("Wystąpił błąd podczas usuwania elementu z bazy danych");
      });
  };

  const getEndPointForMap = useMemo(
    () =>
      ({ lat, lng, name }) => {
        setEndPoint({ lat: lat, lng: lng, name: name });
      },
    []
  );

  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6 mt-5">
          <div>
            <Heading
              title="Mapa dojazdu"
              subtitle="Mapa dojazdu do miejsca docelowego wycieczki"
            />
            <hr className="mb-2" />
            <div className="w-full  h-96">
              <AddTrailMap showDirections endPoint={endPoint} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-5">
          {tripData?.reservations?.length > 0 ? (
            <div>
              <Heading
                title="Twoje rezerwacje"
                subtitle="Lista zarezerwowanych noclegów dla tej wycieczki"
              />
              <hr className="mb-2" />
              {tripData?.reservations?.map((reservation, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-32 w-full my-2 space-x-2 relative"
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
                  {/* pokaż na mapie - przycisk */}
                  <div className="absolute bottom-0 right-0">
                    <button
                      className="flex items-center justify-center bg-green-400 border-2 border-green-400 text-white p-1 rounded-2xl cursor-pointer hover:bg-white hover:text-green-400 hover:border-gray-400 transition ease-in-out duration-300 text-sm "
                      onClick={(e) => {
                        e.stopPropagation();
                        getEndPointForMap({
                          lat: reservation.listing.lat,
                          lng: reservation.listing.long,
                          name: reservation.listing.title,
                        });
                      }}
                    >
                      <span className="">Mapa|</span>
                      <BsFillPinMapFill />
                    </button>
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
              {tripData?.attractions?.map((attraction, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-32 w-full my-2 space-x-2 relative"
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
                  {/* pokaż na mapie - przycisk */}
                  <div className="absolute bottom-0 right-0">
                    <button
                      className="flex items-center justify-center bg-green-400 border-2 border-green-400 text-white p-1 rounded-2xl cursor-pointer hover:bg-white hover:text-green-400 hover:border-gray-400 transition ease-in-out duration-300 text-sm "
                      onClick={(e) => {
                        e.stopPropagation();
                        getEndPointForMap({
                          lat: attraction.lat,
                          lng: attraction.long,
                          name: attraction.title,
                        });
                      }}
                    >
                      <span className="">Mapa|</span>
                      <BsFillPinMapFill />
                    </button>
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
              {tripData?.trails?.map((trail, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 h-48 w-full my-2 space-x-2 relative"
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
                  {/* pokaż na mapie - przycisk */}
                  <div className="absolute bottom-0 right-0">
                    <button
                      className="flex items-center justify-center bg-green-400 border-2 border-green-400 text-white p-1 rounded-2xl cursor-pointer hover:bg-white hover:text-green-400 hover:border-gray-400 transition ease-in-out duration-300 text-sm "
                      onClick={(e) => {
                        e.stopPropagation();
                        getEndPointForMap({
                          lat: trail.locations[0].lat,
                          lng: trail.locations[0].long,
                          name: trail.title,
                        });
                      }}
                    >
                      <span className="">Mapa|</span>
                      <BsFillPinMapFill />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 mt-5 mb-16">
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
                  {tripData?.savedItems?.map((item, index) => (
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
