import { usePathname } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import Header from "../../../components/Header";
import axios from "axios";
import { toast } from "react-hot-toast";
import TripClient from "../../../components/trips/TripClient";

const IndividualTripPage = () => {
  // ------------------------------------- get tripId from url
  const path = usePathname();
  const tripId = path?.substring(7);

  // ------------------------------------- fetch trip data from db and set Loader
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState({});

  const fetchTripData = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/getTripById`, {
        tripId: tripId,
      })
      .then((res) => {
        setTripData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Coś poszło nie tak...");
      });
  };

  useMemo(() => {
    if (
      tripId === undefined ||
      tripId === "" ||
      tripId === null ||
      tripId === {}
    ) {
      return;
    }
    // ------------------------------------- fetch trip data from db
    setIsLoading(true);

    fetchTripData();
  }, [tripId]);

  const refetchTripData = useCallback(async (tripID) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/getTripById`, {
        tripId: tripID,
      })
      .then((res) => {
        setTripData(res.data);
      })
      .catch((err) => {
        toast.error("Coś poszło nie tak...");
      });
  }, []);

  // ------------------------------------- render Loader
  if (isLoading) {
    return (
      <div>
        <Header page="Listings" />
        <div>Loading...</div>
      </div>
    );
  }

  // ------------------------------------- render trip
  console.log(tripData);

  return (
    <div>
      <Header page="Listings" placeholder={tripData?.name} />

      <TripClient tripData={tripData} refetchTripData={refetchTripData} />
    </div>
  );
};

export default IndividualTripPage;
