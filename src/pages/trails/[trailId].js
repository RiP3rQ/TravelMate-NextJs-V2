import React, { useCallback, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import TrailClient from "../../../components/trails/TrailClient";

const IndividualTrailPage = () => {
  // ------------------------------------- get trailId from url
  const path = usePathname();
  const trailId = path?.substring(8);
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

  // ------------------------------------- fetch trail data from db and set Loader
  const [isLoading, setIsLoading] = useState(true);
  const [trailData, setTrailData] = useState({});

  useMemo(() => {
    if (
      trailId === undefined ||
      trailId === "" ||
      trailId === null ||
      trailId === {}
    ) {
      return;
    }
    // ------------------------------------- fetch trail data from db
    const fetchTrailData = async () => {
      await axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/trails/getTrailById`, {
          trailId,
        })
        .then((res) => {
          setTrailData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        });
    };
    fetchTrailData();
  }, [trailId]);

  // ------------------------------------- render loader
  if (isLoading) {
    return (
      <div>
        <Header page="Trails" />
        <div>Loading...</div>
      </div>
    );
  }

  if (!isLoading) {
    return (
      <div>
        <Header page="Trails" placeholder={trailData.title} />
        <TrailClient
          listing={trailData}
          currentUser={currentUser}
          refetchUser={refetchUser}
        />
      </div>
    );
  }
};

export default IndividualTrailPage;
