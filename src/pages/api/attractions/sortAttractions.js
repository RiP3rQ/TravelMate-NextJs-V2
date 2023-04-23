import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { sortingCategory, typeOfSorting } = req.body;

  let attractions;

  // Sortowanie wg. ceny rosnąco
  if (sortingCategory === "Cena" && typeOfSorting === "Rosnąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }

  // Sortowanie wg. ceny malejąco
  if (sortingCategory === "Cena" && typeOfSorting === "Malejąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        price: "desc",
      },
    });
  }

  // Sortowanie wg. opinii rosnąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Rosnąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        star: "asc",
      },
    });
  }

  // Sortowanie wg. opinii malejąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Malejąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        star: "desc",
      },
    });
  }

  // Sortowanie wg. kategorii rosnąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Rosnąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        category: "asc",
      },
    });
  }

  // Sortowanie wg. kategorii malejąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Malejąco") {
    attractions = await prisma.attraction.findMany({
      orderBy: {
        category: "desc",
      },
    });
  }

  // Sortowanie wg. liczby recenzji rosnąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Rosnąco") {
    attractions = await prisma.attraction.findMany({
      include: {
        attraction_reviews: true,
      },
      orderBy: {
        attraction_reviews: {
          _count: "asc",
        },
      },
    });
  }

  // Sortowanie wg. liczby recenzji malejąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Malejąco") {
    attractions = await prisma.attraction.findMany({
      include: {
        attraction_reviews: true,
      },
      orderBy: {
        attraction_reviews: {
          _count: "desc",
        },
      },
    });
  }

  if (!attractions || attractions.length === 0) {
    return res.status(200).json({ error: "Attractions not found!" });
  }

  const safeAttractions = attractions.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  return res.status(200).json(safeAttractions);
}
