import Image from "next/image";
import MyMap from "../MyMap";

const ListingInfo = ({
  guestCount,
  roomCount,
  bathroomCount,
  category,
  user,
  long,
  lat,
}) => {
  const { icon: Icon, label, description: categoryDescription } = category;
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Hosted by {user?.name}</div>
          <Image
            className="rounded-full"
            src={user?.image}
            width={30}
            height={30}
            alt="Avatar"
          />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500 ">
          {guestCount && roomCount && bathroomCount && (
            <>
              <div>{guestCount} guests</div>
              <div>{roomCount} rooms</div>
              <div>{bathroomCount} bathrooms</div>
            </>
          )}
        </div>
      </div>
      <hr />
      {category && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-4">
            <Icon size={40} className="text-neutral-600" />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{label}</div>
              <div className="text-neutral-500 font-light">
                {categoryDescription}
              </div>
            </div>
          </div>
        </div>
      )}
      <hr />
      <div className="h-[30vh] w-full">
        <MyMap isListingMap lat={lat} long={long} />
      </div>
    </div>
  );
};

export default ListingInfo;
