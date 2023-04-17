import Heading from "../modals/Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";

const ListingHead = ({
  title,
  description,
  imageSrc,
  id,
  currentUser,
  refetchUser,
}) => {
  return (
    <>
      <Heading title={title} subtitle={description} />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          src={imageSrc}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div className="absolute top-5 right-5">
          <HeartButton
            listingId={id}
            currentUser={currentUser}
            refetchUser={refetchUser}
          />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
