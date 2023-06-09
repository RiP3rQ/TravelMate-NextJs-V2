import React, { useCallback, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingClient from "../../../components/listings/ListingClient";

const IndividualListingPage = () => {
  // ------------------------------------- get listingId from url
  const path = usePathname();
  const listingId = path?.substring(10);
  // ------------------------------------- current User data
  const [currentUser, setCurrentUser] = useState(null);

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

  const refetchUser = useCallback(() => {
    user();
  }, []);

  // ------------------------------------- fetch listing data from db and set Loader
  const [isLoading, setIsLoading] = useState(true);
  const [listingData, setListingData] = useState({});
  const [reservations, setReservations] = useState([]);

  useMemo(() => {
    if (
      listingId === undefined ||
      listingId === "" ||
      listingId === null ||
      listingId === {}
    ) {
      return;
    }
    // ------------------------------------- fetch listing data from db
    const fetchListingData = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/listings/getListingById`, {
          listingId,
        })
        .then((res) => {
          setListingData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        });
    };

    fetchListingData();

    // ------------------------------------- fetch reservations data from db
    const fetchListingReservations = async () => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/reservations/getAllListingReservations`,
          {
            listingId,
          }
        )
        .then((res) => {
          setReservations(res.data);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        });
    };
    fetchListingReservations();
  }, [listingId]);

  // ------------------------------------- render loader
  if (isLoading) {
    return (
      <div>
        <Header page="Listings" />
        <div>Loading...</div>
      </div>
    );
  }

  if (!isLoading) {
    return (
      <div>
        <Header page="Listings" placeholder={listingData.title} />
        <ListingClient
          listing={listingData}
          currentUser={currentUser}
          refetchUser={refetchUser}
          reservations={reservations}
        />
      </div>
    );
  }
};

export default IndividualListingPage;
