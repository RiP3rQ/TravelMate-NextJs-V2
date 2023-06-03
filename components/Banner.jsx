import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Banner = () => {
  const router = useRouter();

  return (
    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px]">
      <Image
        src="https://links.papareact.com/0fm"
        alt="banner background"
        fill
        style={{ objectFit: "cover" }}
      />

      <div className="absolute top-36 w-full text-center lg:top-64">
        <p className="text-xs sm:text-lg md:text-xl lg:text-3xl font-bold">
          Planujesz swoje wymarzone wakacje? Świetnie!{" "}
        </p>
        <p className="text-xs sm:text-lg md:text-xl lg:text-3xl  font-bold">
          Zaplanuj je z nami!
        </p>
        <button
          className="text-green-500 bg-white md:px-8 md:py-3 md:text-lg px-2 py-2 text-xs
        shadow-md rounded-full font-bold my-3 hover:shadow-xl 
        active:scale-90 transition duration-150"
          onClick={() => router.push("/trips")}
        >
          Zaplanuj
        </button>
      </div>
    </div>
  );
};

export default Banner;
