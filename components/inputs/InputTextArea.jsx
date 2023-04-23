import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

const InputTextArea = ({
  id,
  label,
  type = "text",
  disabled,
  register,
  required,
  errors,
}) => {
  return (
    <div className="w-full relative">
      <textarea
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=" "
        type={type}
        className={`
              peer
              w-full
              p-4
              pt-6 
              font-light 
              bg-white 
              border-2
              rounded-md
              outline-none
              transition
              disabled:opacity-70
              disabled:cursor-not-allowed
              ${errors[id] ? "border-rose-500" : "border-neutral-300"}
              ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
            `}
      />
      <label
        className={`
              absolute 
              text-md
              duration-150 
              transform 
              -translate-y-3 
              top-5 
              left-4
              z-10 
              origin-[0] 
              peer-placeholder-shown:scale-100 
              peer-placeholder-shown:translate-y-0 
              peer-focus:scale-75
              peer-focus:-translate-y-4
              ${errors[id] ? "text-rose-500" : "text-zinc-400"}
            `}
      >
        {label}
      </label>
    </div>
  );
};

export default InputTextArea;
