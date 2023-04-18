import React, { useCallback, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import AttractionClient from "../../../components/attractions/AttractionClient";

const IndividualAttractionPage = () => {
  // ------------------------------------- get listingId from url
  const path = usePathname();
  const attractionId = path?.substring(13);

  // ------------------------------------- current User data
  const [currentUser, setCurrentUser] = useState(null);

  const user = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/auth/getCurrentUser"
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
  const [attractionData, setAttractionData] = useState(null);

  useMemo(() => {
    if (
      attractionId === undefined ||
      attractionId === "" ||
      attractionId === null ||
      attractionId === {}
    ) {
      return;
    }
    const fetchAttractionData = async () => {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/attractions/getAttractionsById`,
          {
            attractionId,
          }
        )
        .then((res) => {
          setAttractionData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        });
    };
    fetchAttractionData();
  }, [attractionId]);

  // ------------------------------------- render loader
  if (isLoading) {
    return (
      <div>
        <Header page="Attractions" />
        <div>Loading...</div>
      </div>
    );
  }

  // ------------------------------------- main page with data
  if (!isLoading) {
    return (
      <div>
        <Header page="Attractions" placeholder={attractionData.title} />
        <AttractionClient
          attraction={attractionData}
          currentUser={currentUser}
          refetchUser={refetchUser}
        />
      </div>
    );
  }
};

export default IndividualAttractionPage;
