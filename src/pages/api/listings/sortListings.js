import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { sortingCategory, typeOfSorting, selectedLastCategory } = req.body;

  let listings;

  // Sortowanie wg. ceny rosnąco
  if (sortingCategory === "Cena" && typeOfSorting === "Rosnąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }

  // Sortowanie wg. ceny malejąco
  if (sortingCategory === "Cena" && typeOfSorting === "Malejąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        price: "desc",
      },
    });
  }

  // Sortowanie wg. opinii rosnąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Rosnąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        star: "asc",
      },
    });
  }

  // Sortowanie wg. opinii malejąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Malejąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        star: "desc",
      },
    });
  }

  // Sortowanie wg. kategorii rosnąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Rosnąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        category: "asc",
      },
    });
  }

  // Sortowanie wg. kategorii malejąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Malejąco") {
    listings = await prisma.listing.findMany({
      orderBy: {
        category: "desc",
      },
    });
  }

  // Sortowanie wg. liczby recenzji rosnąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Rosnąco") {
    listings = await prisma.listing.findMany({
      include: {
        listing_reviews: true,
      },
      orderBy: {
        listing_reviews: {
          _count: "asc",
        },
      },
    });
  }

  // Sortowanie wg. liczby recenzji malejąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Malejąco") {
    listings = await prisma.listing.findMany({
      include: {
        listing_reviews: true,
      },
      orderBy: {
        listing_reviews: {
          _count: "desc",
        },
      },
    });
  }

  // Sortowanie wg. liczby gości rosnąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Rosnąco" &&
    selectedLastCategory === "Liczba Gości"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        guestCount: "asc",
      },
    });
  }

  // Sortowanie wg. liczby gości malejąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Malejąco" &&
    selectedLastCategory === "Liczba Gości"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        guestCount: "desc",
      },
    });
  }

  // Sortowanie wg. liczby pokoi rosnąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Rosnąco" &&
    selectedLastCategory === "Liczba Pokoi"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        roomCount: "asc",
      },
    });
  }

  // Sortowanie wg. liczby pokoi malejąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Malejąco" &&
    selectedLastCategory === "Liczba Pokoi"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        roomCount: "desc",
      },
    });
  }

  // Sortowanie wg. liczby łazienek rosnąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Rosnąco" &&
    selectedLastCategory === "Liczba Łazienek"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        bathroomCount: "asc",
      },
    });
  }

  // Sortowanie wg. liczby łazienek malejąco
  if (
    sortingCategory === "Liczba Gości/Pokoi/Łazienek" &&
    typeOfSorting === "Malejąco" &&
    selectedLastCategory === "Liczba Łazienek"
  ) {
    listings = await prisma.listing.findMany({
      orderBy: {
        bathroomCount: "desc",
      },
    });
  }

  if (!listings || listings.length === 0) {
    return res.status(200).json({ error: "Listings not found!" });
  }

  const safeListings = listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  return res.status(200).json(safeListings);
}
