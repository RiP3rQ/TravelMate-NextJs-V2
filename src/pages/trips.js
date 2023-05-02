import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import Heading from "../../components/modals/Heading";

const Trips = () => {
  const router = useRouter();
  const { data: session } = useSession();
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

  return (
    <div>
      <Header />
      <div className="pt-3 px-5">
        <div className=" border-b-2 border-gray-500 w-52">
          <Heading title="Wycieczki" subtitle="Lista zaplanowanych wycieczek" />
        </div>
        <div
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          xl:grid-cols-5 gap-8"
        >
          ESSA
        </div>
      </div>
    </div>
  );
};

export default Trips;
