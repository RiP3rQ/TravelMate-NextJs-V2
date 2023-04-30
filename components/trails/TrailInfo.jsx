import Image from "next/image";

const TrailInfo = ({ category, user }) => {
  const { icon: Icon, label, description: categoryDescription } = category;
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div>Dodane przez: {user?.name}</div>
          <Image
            className="rounded-full"
            src={user?.image}
            width={30}
            height={30}
            alt="Avatar"
          />
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
    </div>
  );
};

export default TrailInfo;
