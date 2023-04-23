import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { sortingCategory, typeOfSorting } = req.body;

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

  if (!listings || listings.length === 0) {
    return res.status(200).json({ error: "Listings not found!" });
  }

  const safeListings = listings.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  return res.status(200).json(safeListings);
}
