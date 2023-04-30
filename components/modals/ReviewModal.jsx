import Modal from "./Modal";
import Heading from "./Heading";
import useReviewModal from "../../hooks/useReviewModal";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import { useRouter } from "next/navigation";

// star icons import
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import InputTextArea from "../inputs/InputTextArea";

const STEPS = {
  RATING: 0,
  INFO: 1,
  IMAGE: 2,
};

const ReviewModal = () => {
  const router = useRouter();
  // global state of review modal using zustand
  const reviewModal = useReviewModal();
  // page of the modal
  const page = reviewModal.page;
  const itemId = reviewModal.itemId;
  // steps of the modal
  const [step, setStep] = useState(STEPS.RATING);
  const [isLoading, setIsLoading] = useState(false);
  // stars rating
  const [hoverRating, setHoverRating] = useState(0);
  const [clickedRating, setClickedRating] = useState(0);

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
          toast.loading("Strona zostanie odświeżona...");
          reset();
          reviewModal.onClose();
          setStep(STEPS.RATING);
          // odświeżenie strony
          setTimeout(() => {
            router.refresh();
          }, 2000);
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
          toast.loading("Strona zostanie odświeżona...");
          reset();
          reviewModal.onClose();
          setStep(STEPS.RATING);
          // odświeżenie strony
          setTimeout(() => {
            router.refresh();
          }, 2000);
        })
        .catch((err) => {
          toast.error("Coś poszło nie tak...");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    // ------------------------------------ zapisywanie do bazy danych SZLAKÓW ------------------------------------
    if (page === "Trails") {
      axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/reviews/addTrailReview`, {
          ...data,
          trailId: itemId,
        })
        .then((res) => {
          toast.success("Pomyślnie dodano recenzję szlaku!");
          toast.loading("Strona zostanie odświeżona...");
          reset();
          reviewModal.onClose();
          setStep(STEPS.RATING);
          // odświeżenie strony
          setTimeout(() => {
            router.refresh();
          }, 2000);
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
  function shouldBeHighlighted(rating) {
    return rating <= (hoverRating || clickedRating);
  }

  // content of the modal based on step 1 - rating
  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="To miejsce sprawiło na Tobie wrażenie?"
        subtitle="Już teraz możesz ocenić to miejsce i pomóc innym użytkownikom w wyborze"
      />
      {/* rating using stars*/}
      <ul className="flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((rating) => (
          <li
            key={rating}
            className="cursor-pointer"
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => {
              setClickedRating(rating);
              setCustomValue("rating", rating);
            }}
          >
            <BsStarFill
              size={40}
              className={`${
                shouldBeHighlighted(rating)
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            />
          </li>
        ))}
      </ul>
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
        <InputTextArea
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
