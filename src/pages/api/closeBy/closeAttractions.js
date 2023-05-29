import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { listingId } = req.body;

  let listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return res.status(404).json({
      error: "Listing not found",
    });
  }

  const closeByAttractions = await prisma.Attraction.findMany({
    where: {
      OR: [
        {
          lat: {
            gte: (parseFloat(listing.lat) - 0.1).toString(),
            lte: (parseFloat(listing.lat) + 0.1).toString(),
          },
        },
        {
          long: {
            gte: (parseFloat(listing.long) - 0.1).toString(),
            lte: (parseFloat(listing.long) + 0.1).toString(),
          },
        },
      ],
    },
    take: 3,
  });

  return res.status(200).json(closeByAttractions);
}
