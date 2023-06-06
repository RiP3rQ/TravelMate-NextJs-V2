import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import axios from "axios";
import ListingCard from "../../components/listings/ListingCard";
import Heading from "../../components/modals/Heading";
import { toast } from "react-hot-toast";

const Reservations = () => {
  // ----------------------------- States ----------------------------- //
  const [reservations, setReservations] = useState(null);
  const [boughtTickets, setBoughtTickets] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [trips, setTrips] = useState(null);

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

  const refetchUser = useCallback(() => {
    user();
  }, []);

  // ----------------------------- Fetching Reserations ----------------------------- //

  const fetchReservations = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/reservations/getAllListingReservations`,
      {
        userId: currentUser?.id,
      }
    );
    if (res.data.message === "No reservations found!") {
      return;
    } else {
      setReservations(res.data);
    }
  };

  // ----------------------------- Fetching Trips ----------------------------- //

  const fetchTrips = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/trips/getAllTripsMinimum`,
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

  // ----------------------------- Fetching Bought Tickets ----------------------------- //

  const fetchBoughtTickets = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/reservations/getAllAttractionTickets`,
      {
        userId: currentUser?.id,
      }
    );
    if (res.data.message === "No tickets found!") {
      return;
    } else {
      setBoughtTickets(res.data);
    }
  };

  // ----------------------------- Fetching Data ----------------------------- //
  useEffect(() => {
    if (!currentUser) return;
    fetchTrips();
    fetchReservations();
    fetchBoughtTickets();
  }, [currentUser]);

  // ----------------------------- Cancel reservation/ticket ----------------------------- //
  const cancelReservation = useCallback(
    async (reservationId) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/reservations/deleteReservationOrTicket`,
          {
            reservationId: reservationId,
            currentUserId: currentUser?.id,
          }
        )
        .then(() => toast.success("Rezerwacja anulowana!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchReservations();
        });
    },
    [currentUser]
  );
  const cancelTicket = useCallback(
    async (ticketId) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/reservations/deleteReservationOrTicket`,
          {
            ticketId: ticketId,
            currentUserId: currentUser?.id,
          }
        )
        .then(() => toast.success("Bilet anulowany!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchBoughtTickets();
        });
    },
    [currentUser]
  );

  // ----------------------------- Add to trips  ----------------------------- //
  const addToTrips = useCallback(
    async (listingId) => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/addNewTrip`, {
          listingId: listingId,
        })
        .then(() => toast.success("Dodano nową wycieczkę!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  const addToExistingTrip = useCallback(
    async (listingId, tripId, page) => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/trips/addListingToTrip`, {
          listingId: listingId,
          tripId: tripId,
          page: page,
        })
        .then(() => toast.success("Dodano do istniejącej  wycieczki!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  const deleteFromTrip = useCallback(
    async (listingId, tripId, page) => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/trips/deleteListingFromTrip`,
          {
            listingId: listingId,
            tripId: tripId,
            page: page,
          }
        )
        .then(() => toast.success("Usunięto z wycieczki!"))
        .catch(() => toast.error("Wystąpił błąd!"))
        .finally(() => {
          fetchTrips();
        });
    },
    [currentUser]
  );

  // ----------------------------- Render if null ----------------------------- //
  if (
    (reservations?.length === 0 && boughtTickets?.length === 0) ||
    (reservations === null && boughtTickets === null)
  ) {
    return (
      <div>
        <Header />
        <EmptyState
          title="Nie znaleziono rezerwacji! "
          subtitle="Wygląda na to, że nie masz jeszcze żadnych rezerwacji."
        />
      </div>
    );
  }

  // ----------------------------- Render main page----------------------------- //
  return (
    <div>
      <Header />

      {reservations?.length > 0 && (
        <div className="pt-3 px-5">
          <div className=" border-b-2 border-gray-500 w-64">
            <Heading
              title="Rezerwacje noclegów"
              subtitle="Lista zarezerwowanych noclegów"
            />
          </div>

          <div
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8"
          >
            {reservations?.map((reservation) => (
              <ListingCard
                currentUser={currentUser}
                key={reservation.listing.id + reservation.id}
                actionId={reservation.id}
                data={reservation.listing}
                refetchUser={refetchUser}
                actionLabel="Anuluj rezerwację"
                onAction={cancelReservation}
                page="Listings"
                reservation={reservation}
                disabled={!currentUser}
                abilityToAddToTrips
                addToTrips={addToTrips}
                trips={trips}
                addToExistingTrip={addToExistingTrip}
                deleteFromTrip={deleteFromTrip}
              />
            ))}
          </div>
        </div>
      )}

      {boughtTickets?.length > 0 && (
        <div className="pt-3 pl-5">
          <div className="pt-1 border-b-2 border-gray-500 w-96">
            <Heading
              title="Zarezerwowane bilety na atrakcje"
              subtitle="Lista zakupionych biletów na atrakcje"
            />
          </div>

          <div
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8 mb-8"
          >
            {boughtTickets?.map((ticket) => (
              <ListingCard
                currentUser={currentUser}
                key={ticket.attraction.id + ticket.id}
                actionId={ticket.id}
                data={ticket.attraction}
                refetchUser={refetchUser}
                actionLabel="Zwróć bilet"
                onAction={cancelTicket}
                page="Attractions"
                disabled={!currentUser}
                abilityToAddToTrips
                addToTrips={addToTrips}
                trips={trips}
                addToExistingTrip={addToExistingTrip}
                deleteFromTrip={deleteFromTrip}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
