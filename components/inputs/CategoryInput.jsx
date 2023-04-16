const CategoryInput = ({ icon: Icon, label, selected, onClick }) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`h-max w-1/2 bg-green-300 m-2 flex items-center justify-center p-4 border-4 rounded-xl cursor-pointer relative ${
        selected ? "border-black" : "border-slate-300"
      }`}
    >
      <div className="absolute top-3 left-5">
        <Icon size={30} />
      </div>

      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
