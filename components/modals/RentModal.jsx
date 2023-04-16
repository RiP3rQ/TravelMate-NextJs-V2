import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "../../hooks/useRentModal";
import Heading from "./Heading";
import { list } from "../Header";
import { types } from "../../src/pages/index";
import CategoryInput from "../inputs/CategoryInput";
import { useForm } from "react-hook-form";
import MyMap from "../MyMap";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";

const STEPS = {
  CATEGORY: 0,
  TYPE: 1,
  LOCATION: 2,
  INFO: 3,
  IMAGES: 4,
  DESCRIPTION: 5,
  PRICE: 6,
};

const RentModal = () => {
  const router = useRouter();
  // global state of rent modal using zustand
  const rentModal = useRentModal();
  // steps of the modal
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

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
      type: "",
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
  // step 2 - type
  const type = watch("type");
  // step 3 - location
  const lat = watch("lat");
  const long = watch("long");
  // step 4 - info
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  // step 5 - images
  const imageSrc = watch("imageSrc");
  // step 6 - description
  const title = watch("title");
  const description = watch("description");
  // step 7 - price
  const price = watch("price");

  // ------------------------------------ actions ------------------------------------
  // go back to previous step
  const onBack = () => {
    setStep((prev) => prev - 1);
  };

  // go to next step
  const onNext = () => {
    setStep((prev) => prev + 1);
  };

  // --------------- submit logic
  const onSubmit = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings/addListing", data)
      .then((res) => {
        toast.success("Listing Created!");
        reset();
        rentModal.onClose();
        setStep(STEPS.CATEGORY);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  // content of the modal based on step 2 - type
  if (step === STEPS.TYPE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Podaj typ miejsca, które chcesz dodać do TravelMate."
          subtitle="Pokaż użytkownikom czym cechuje się Twojego miejsca"
        />
        <div
          className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
        >
          {types.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                onClick={(type) => {
                  setCustomValue("type", type);
                }}
                selected={type === item.label}
                label={item.label}
                icon={item.icon}
                grid
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // content of the modal based on step 3 - location
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

  // content of the modal based on step 4 - info
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Podaj podstawowe informacje o miejscu."
          subtitle="Pokaż użytkownikom liczbę gości, pokoje i łazienki"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="Liczba gości"
          subtitle="Ile gości może pomieścić posiadłość?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("roomCount", value)}
          value={roomCount}
          title="Liczba pokoi"
          subtitle="Ile posiada pokoi?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("bathroomCount", value)}
          value={bathroomCount}
          title="Liczba łazienek"
          subtitle="Ile łazienek ma posiadłość?"
        />
      </div>
    );
  }

  // content of the modal based on step 5 - images
  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Dodaj zdjęcia swojego miejsca."
          subtitle="Pokaż użytkownikom na co się piszą!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  // content of the modal based on step 6 - description
  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Opisz swoje miejsce."
          subtitle="Krótko, zwięźle i na temat!"
        />
        <Input
          id="title"
          label="Tytuł"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Opis"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  // content of the modal based on step 7 - price
  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Już prawie skończone! Podaj cenę swojego miejsca."
          subtitle="Ile chcesz pobierać za jedną noc?"
        />
        <Input
          id="price"
          label="Cena"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Zostań Mate-em"
      body={bodyContent}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  );
};

export default RentModal;
