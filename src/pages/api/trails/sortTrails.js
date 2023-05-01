import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { sortingCategory, typeOfSorting } = req.body;

  let trails;

  // Sortowanie wg. ceny rosnąco
  if (sortingCategory === "Cena" && typeOfSorting === "Rosnąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }

  // Sortowanie wg. ceny malejąco
  if (sortingCategory === "Cena" && typeOfSorting === "Malejąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        price: "desc",
      },
    });
  }

  // Sortowanie wg. opinii rosnąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Rosnąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        star: "asc",
      },
    });
  }

  // Sortowanie wg. opinii malejąco
  if (sortingCategory === "Opinie" && typeOfSorting === "Malejąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        star: "desc",
      },
    });
  }

  // Sortowanie wg. kategorii rosnąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Rosnąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        category: "asc",
      },
    });
  }

  // Sortowanie wg. kategorii malejąco
  if (sortingCategory === "Kategorie" && typeOfSorting === "Malejąco") {
    trails = await prisma.trail.findMany({
      orderBy: {
        category: "desc",
      },
    });
  }

  // Sortowanie wg. liczby recenzji rosnąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Rosnąco") {
    trails = await prisma.trail.findMany({
      include: {
        trail_reviews: true,
      },
      orderBy: {
        trail_reviews: {
          _count: "asc",
        },
      },
    });
  }

  // Sortowanie wg. liczby recenzji malejąco
  if (sortingCategory === "Liczba recenzji" && typeOfSorting === "Malejąco") {
    trails = await prisma.trail.findMany({
      include: {
        trail_reviews: true,
      },
      orderBy: {
        trail_reviews: {
          _count: "desc",
        },
      },
    });
  }

  if (!trails || trails.length === 0) {
    return res.status(200).json({ error: "Trails not found!" });
  }

  const safeTrails = trails.map((trail) => ({
    ...trail,
    createdAt: trail.createdAt.toISOString(),
  }));

  return res.status(200).json(safeTrails);
}
