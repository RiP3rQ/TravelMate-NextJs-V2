import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Heading from "../../components/modals/Heading";
import { toast } from "react-hot-toast";
import { AiOutlineFolderAdd } from "react-icons/ai";
import TripCard from "../../components/trips/TripCard";

const Trips = () => {
  const [trips, setTrips] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ----------------------------- User ----------------------------- //
  const user = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/getCurrentUser`
    );
    if (res.data.message === "Not logged In!") {
      return;
    } else {
      setCurrentUser(res.data);
    }
  };

  useMemo(() => {
    user();
  }, []);

  // ----------------------------- Fetching Trips ----------------------------- //

  const fetchTrips = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/trips/getAllTrips`,
      {
        email: currentUser?.email,
      }
    );
    if (res.data.message === "No trips found!") {
      return;
    } else {
      setTrips(res.data);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchTrips();
  }, [currentUser]);

  // ----------------------------- Deleting trip ----------------------------- //
  const handleDelete = async (id) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/deleteTrip`, {
        tripId: id,
      })
      .then(() => {
        toast.success("Wycieczka została usunięta!");
        fetchTrips();
      })
      .catch(() => {
        toast.error("Coś poszło nie tak!");
      });
  };

  // ----------------------------- Add new trip ----------------------------- //
  const handleAddNewTrip = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/addNewTrip`)
      .then(() => {
        toast.success("Dodano nową wycieczkę!");
        fetchTrips();
      })
      .catch(() => toast.error("Wystąpił błąd!"));
  };

  // ----------------------------- Change trip name ----------------------------- //
  const handleChangeTripName = async (id, name) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/changeTripName`, {
        tripId: id,
        tripName: name,
      })
      .then(() => {
        toast.success("Nazwa wycieczki została zmieniona!");
        fetchTrips();
      })
      .catch(() => toast.error("Wystąpił błąd!"));
  };

  return (
    <div className="relative min-h-screen w-full">
      <Header />
      <div className="pt-3 px-5">
        <div className=" border-b-2 border-gray-500 w-52">
          <Heading title="Wycieczki" subtitle="Lista zaplanowanych wycieczek" />
        </div>
        <div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8"
        >
          {trips?.map((trip, index) => (
            <TripCard
              trip={trip}
              index={index}
              handleDelete={handleDelete}
              handleChangeTripName={handleChangeTripName}
            />
          ))}
        </div>
      </div>
      <div
        className="absolute bottom-3 right-3 flex items-center justify-center bg-green-500 px-4 py-2 rounded-xl border-2 border-transparent text-white cursor-pointer 
      hover:text-green-500 hover:bg-white hover:border-green-500 hover:animate-pulse transition duration-300 ease-in-out z-50"
        onClick={handleAddNewTrip}
      >
        <AiOutlineFolderAdd className="text-4xl mr-2" />
        <div className="text-2xl">Dodaj nową wycieczkę</div>
      </div>
    </div>
  );
};

export default Trips;
