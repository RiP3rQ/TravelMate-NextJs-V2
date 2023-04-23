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
    label: "Rosnąco",
    icon: AiOutlineArrowUp,
  },
  {
    label: "Malejąco",
    icon: AiOutlineArrowDown,
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
  const [typeOfSorting, setTypeOfSorting] = useState("");
  const [selectedLastCategory, setSelectedLastCategory] = useState("");

  // ------------------------------ OBSŁUGA SORTOWANIA ------------------------------ //
  const handleSort = () => {
    // defensive programming
    if (sortingCategory === "" || typeOfSorting === "") {
      toast.error("Wybierz sortowania rosnąco/malejąco");
      return;
    }
    // sortowanie po cenie
    if (sortingCategory === "Cena") {
      if (typeOfSorting === "Rosnąco") {
        const powiadomienie = toast.loading("Sortowanie rosnąco w toku...");
        axios
          .post(`${process.env.NEXT_PUBLIC_URL}/api/listings/sortListings`, {
            sortingCategory: sortingCategory,
            typeOfSorting: typeOfSorting,
          })
          .then((res) => {
            console.log(res.data);
          })
          .then(() => {
            toast.dismiss(powiadomienie);
            toast.success("Sortowanie rosnąco zakończone");
          });
        sortingModal.onClose();
        return;
      } else if (typeOfSorting === "Malejąco") {
        const powiadomienie = toast.loading("Sortowanie malejąco w toku...");
        axios
          .post(`${process.env.NEXT_PUBLIC_URL}/api/listings/sortListings`, {
            sortingCategory: sortingCategory,
            typeOfSorting: typeOfSorting,
          })
          .then((res) => {
            console.log(res.data);
          })
          .then(() => {
            toast.dismiss(powiadomienie);
            toast.success("Sortowanie malejąco zakończone");
          });
        sortingModal.onClose();
        return;
      } else {
        toast.error("Wybierz rodzaj sortowania");
        return;
      }
    }
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
