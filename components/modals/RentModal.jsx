import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "../../hooks/useRentModal";
import Counter from "../inputs/Counter";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Heading from "./Heading";
import { list } from "../Header";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import MyMap from "../MyMap";

const STEPS = {
  CATEGORY: 0,
  LOCATION: 1,
  INFO: 2,
  IMAGES: 3,
  DESCRIPTION: 4,
  PRICE: 5,
};

const RentModal = () => {
  // global state of rent modal using zustand
  const rentModal = useRentModal();
  // steps of the modal
  const [step, setStep] = useState(STEPS.CATEGORY);

  // ------------------------------------ form state for nocleg ------------------------------------
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "",
      lat: null,
      long: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  // set custom value for react-hook-form
  const setCustomValue = (id, value) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  // step 1 - category
  const category = watch("category");
  // step 2 - location
  const lat = watch("lat");
  const long = watch("long");

  // ------------------------------------ actions ------------------------------------
  // go back to previous step
  const onBack = () => {
    setStep((prev) => prev - 1);
  };

  // go to next step
  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  // ------------------------------------ button labels ------------------------------------

  // button main label based on step for navigation purposes (next or create)
  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    }

    return "Next";
  }, [step]);

  // button secondary label based on step for navigation purposes (back or undefined)
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }

    return "Back";
  }, [step]);

  // ------------------------------------ body content ------------------------------------
  // content of the modal based on step 1 - category
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Które z tych rzeczy chcesz dodać do TravelMate?"
        subtitle="Wybierz kategorię"
      />
      <div
        className="
          flex
          flex-col
          max-h-[50vh]
          overflow-y-auto
          m-1
          w-full
          justify-center
          items-center
        "
      >
        {list.map((item) => (
          <div
            key={item.label}
            className="h-full w-full flex items-center justify-center"
          >
            <CategoryInput
              onClick={(category) => {
                setCustomValue("category", category);
              }}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // content of the modal based on step 2 - location
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Podaj lokalizację miejsca, które chcesz dodać do TravelMate."
          subtitle="Pokaż użytkownikom lokalizację Twojego miejsca"
        />
        <div className="w-full h-96 m-2">
          <MyMap
            rentModal
            onClickRentModal={(long, lat) => {
              setCustomValue("long", long);
              setCustomValue("lat", lat);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={onNext}
      title="Zostań Mate-em"
      body={bodyContent}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  );
};

export default RentModal;
