import React, { useState } from "react";
import Modal from "./Modal";
import useSortingModal from "../../hooks/useSortingModal";
import { toast } from "react-hot-toast";
import CategoryInput from "../inputs/CategoryInput";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineUser,
  AiOutlineHome,
} from "react-icons/ai";
import axios from "axios";

const sortingCategories = [
  {
    label: "Malejąco",
    icon: AiOutlineArrowDown,
  },
  {
    label: "Rosnąco",
    icon: AiOutlineArrowUp,
  },
];

const lastTypeOfSorting = [
  {
    label: "Liczba Gości",
    icon: AiOutlineUser,
  },
  {
    label: "Liczba Pokoi",
    icon: AiOutlineHome,
  },
  {
    label: "Liczba Łazienek",
    icon: AiOutlineHome,
  },
];

const SortingModal = () => {
  const sortingModal = useSortingModal();
  const sortingCategory = sortingModal.category;
  const page = sortingModal.page;

  const [typeOfSorting, setTypeOfSorting] = useState("");
  const [selectedLastCategory, setSelectedLastCategory] = useState("");

  // ------------------------------ OBSŁUGA SORTOWANIA ------------------------------ //
  const handleSort = () => {
    // defensive programming
    if (
      sortingCategory === "" ||
      typeOfSorting === "" ||
      (sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
        selectedLastCategory === "")
    ) {
      toast.error("Wybierz sortowania rosnąco/malejąco");
      return;
    }

    // globalne powiadomienie o rozpoczęciu sortowania
    let powiadomienie = toast.loading("Sortowanie w toku...");

    // wysłanie zapytania do serwera odnośnie sortowania LISITNGÓW
    if (page === "Listings") {
      axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/listings/sortListings`, {
          sortingCategory: sortingCategory,
          typeOfSorting: typeOfSorting,
          selectedLastCategory: selectedLastCategory,
        })
        .then((res) => {
          sortingModal.setNewListings(res.data);
        })
        .then(() => {
          toast.dismiss(powiadomienie);
          toast.success("Sortowanie zakończone!");
        });
    }

    // wysłanie zapytania do serwera odnośnie sortowania ATRAKCJI
    if (page === "Attractions") {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_URL}/api/attractions/sortAttractions`,
          {
            sortingCategory: sortingCategory,
            typeOfSorting: typeOfSorting,
            selectedLastCategory: selectedLastCategory,
          }
        )
        .then((res) => {
          sortingModal.setNewListings(res.data);
        })
        .then(() => {
          toast.dismiss(powiadomienie);
          toast.success("Sortowanie zakończone!");
        });
    }

    // zamknięcie modalu
    setTypeOfSorting("");
    setSelectedLastCategory("");
    sortingModal.onClose();
  };

  // ------------------------------ ZAWARTOŚĆ MODALU ------------------------------ //
  // body content
  let bodyContent;

  // sortowanie po kategorii
  bodyContent = (
    <div className="flex flex-col gap-4">
      {/* Header modalu */}
      <div className="flex gap-2 items-center justify-evenly">
        <p className="text-gray-500">Sortowanie według:</p>
        <span className="font-bold text-gray-400 text-3xl">
          {sortingCategory}
        </span>{" "}
      </div>
      {/* rodzaj sortowania */}
      <p className="text-gray-500">Rodzaj sortowania:</p>
      {sortingCategories.map((sort) => (
        <div
          key={sort.label}
          className="h-full w-full flex items-center justify-center"
        >
          <CategoryInput
            label={sort.label}
            selected={typeOfSorting === sort.label}
            onClick={() => setTypeOfSorting(sort.label)}
            icon={sort.icon}
          />
        </div>
      ))}
    </div>
  );

  // sortowanie po liczbie pokoi
  if (sortingCategory == "Liczba Gości/Pokoi/Łazienek")
    bodyContent = (
      <>
        <div className="flex flex-col gap-4">
          {/* Header modalu */}
          <div className="flex gap-2 items-center justify-evenly">
            <p className="text-gray-500">Sortowanie według:</p>
            <span className="font-bold text-gray-400 text-3xl">
              {sortingCategory}
            </span>{" "}
          </div>
        </div>
        {/* Wybór według czego sortować */}
        <div className="flex items-center justify-evenly my-2 gap-1">
          {lastTypeOfSorting.map((category) => (
            <div key={category.label} className="h-full w-full">
              <CategoryInput
                label={category.label}
                selected={selectedLastCategory === category.label}
                onClick={() => setSelectedLastCategory(category.label)}
                icon={category.icon}
                grid
              />
            </div>
          ))}
        </div>
        {/* rodzaj sortowania */}
        <p className="text-gray-500">Rodzaj sortowania:</p>
        {sortingCategories.map((sort) => (
          <div
            key={sort.label}
            className="h-full w-full flex items-center justify-center"
          >
            <CategoryInput
              label={sort.label}
              selected={typeOfSorting === sort.label}
              onClick={() => setTypeOfSorting(sort.label)}
              icon={sort.icon}
            />
          </div>
        ))}
      </>
    );

  return (
    <Modal
      isOpen={sortingModal.isOpen}
      onClose={sortingModal.onClose}
      onSubmit={handleSort}
      title="Sortowanie"
      body={bodyContent}
      actionLabel="Sortuj"
    />
  );
};

export default SortingModal;
