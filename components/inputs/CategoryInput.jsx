const CategoryInput = ({ icon: Icon, label, selected, onClick, grid }) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`${
        grid ? "w-full" : "w-1/2"
      } h-max  bg-green-300 my-2 flex items-center justify-center p-4 border-4 rounded-xl cursor-pointer relative ${
        selected ? "border-black" : "border-slate-300"
      }`}
    >
      <div className="absolute top-3.5 left-3">
        <Icon size={24} className="hidden 2xl:block" />
      </div>

      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
