import Modal from "./Modal";
import Heading from "./Heading";
import useReviewModal from "../../hooks/useReviewModal";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";

const STEPS = {
  RATING: 0,
  INFO: 1,
  IMAGE: 2,
};

const ReviewModal = () => {
  // global state of review modal using zustand
  const reviewModal = useReviewModal();
  // page of the modal
  const page = reviewModal.page;
  const itemId = reviewModal.itemId;
  // steps of the modal
  const [step, setStep] = useState(STEPS.RATING);
  const [isLoading, setIsLoading] = useState(false);

  // ------------------------------------ form state for review ------------------------------------
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      rating: "",
      title: "",
      description: "",
      imageSrc: "",
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

  // step 1 - RATING
  const rating = watch("rating");
  // step 2 - INFO
  const title = watch("title");
  const description = watch("description");
  // step 3 - IMAGE
  const imageSrc = watch("imageSrc");

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
    if (step !== STEPS.IMAGE) {
      return onNext();
    }

    setIsLoading(true);

    // ------------------------------------ zapisywanie do bazy danych NOCLEGI ------------------------------------
    if (page === "Listings") {
      axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/reviews/addListingReview`, {
          ...data,
          listingId: itemId,
        })
        .then((res) => {
          toast.success("Pomyślnie dodano recenzję noclegu!");
          reset();
          reviewModal.onClose();
          setStep(STEPS.RATING);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // ------------------------------------ zapisywanie do bazy danych ATRACKJE ------------------------------------
    if (page === "Attractions") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/reviews/addAttractionReview`,
          {
            ...data,
            attractionId: itemId,
          }
        )
        .then((res) => {
          toast.success("Pomyślnie dodano recenzję atrackji!");
          reset();
          reviewModal.onClose();
          setStep(STEPS.RATING);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // ------------------------------------ button labels ------------------------------------

  // button main label based on step for navigation purposes (next or create)
  const actionLabel = useMemo(() => {
    if (step === STEPS.IMAGE) {
      return "Dodaj";
    }

    return "Następny krok";
  }, [step]);

  // button secondary label based on step for navigation purposes (back or undefined)
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.RATING) {
      return undefined;
    }

    return "Powrót";
  }, [step]);

  // ------------------------------------ body content ------------------------------------
  // content of the modal based on step 1 - rating
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="To miejsce sprawiło na Tobie wrażenie?"
        subtitle="Już teraz możesz ocenić to miejsce i pomóc innym użytkownikom w wyborze"
      />
      <Input
        id="rating"
        label="Ocena"
        formatPrice
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  // content of the modal based on step 2 - info
  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Opisz twoje doświadczenie z tym miejsce?"
          subtitle="Napisz krótki opis swojej wizyty w tym miejscu i podziel się swoimi wrażeniami"
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

  // content of the modal based on step 2 - info
  if (step === STEPS.IMAGE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Chcesz udostępnić zdjęcie z wizyty w tym miejscu?"
          subtitle="Wstaw zdjęcie swojej wizyty w tym miejscu i podziel się swoimi wrażeniami"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={reviewModal.isOpen}
      onClose={reviewModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      title="Wystaw recenzję miejsca"
      body={bodyContent}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
    />
  );
};

export default ReviewModal;
