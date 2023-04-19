import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  galleryModal,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div
        className={`relative w-full ${
          galleryModal ? "md:w-5/6 lg:w-4/6" : "md:w-4/6 lg:w-3/6 xl:w-2/5"
        } my-6 mx-auto h-full lg:h-auto md:h-auto`}
      >
        {/* CONTENT */}
        <div
          className={`translate duration-300 h-full ${
            showModal ? "translate-y-0" : "translate-y-full"
          } ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* HEADER */}
            <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
              {/* Close button */}

              <XMarkIcon
                className="text-black h-8 p-1 border-0 hover:opacity-70 transition absolute left-5 cursor-pointer"
                onClick={handleClose}
              />
              {/* title */}
              <div className="text-lg font-semibold">{title}</div>
            </div>
            {/* BODY */}
            <div className="relative p-6 flex-auto">{body}</div>
            {/* FOOTER */}
            {
              // if galleryModal is provided, render do not renter the button
              !galleryModal && (
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex flex-row items-center gap-4 w-full">
                    {
                      // If secondaryActionLabel is provided, render the button
                      secondaryActionLabel && secondaryActionLabel && (
                        <Button
                          outline
                          label={secondaryActionLabel}
                          onClick={handleSecondaryAction}
                          disabled={disabled}
                        />
                      )
                    }
                    <Button
                      label={actionLabel}
                      onClick={handleSubmit}
                      disabled={disabled}
                    />
                  </div>
                  {footer}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
