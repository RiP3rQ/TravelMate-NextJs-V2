import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { attractionId } = req.body;

  let attraction = await prisma.attraction.findUnique({
    where: {
      id: attractionId,
    },
  });

  if (!attraction) {
    return res.status(404).json({
      error: "Attraction not found",
    });
  }

  const closeByListings = await prisma.Listing.findMany({
    where: {
      OR: [
        {
          lat: {
            gte: (parseFloat(attraction.lat) - 0.1).toString(),
            lte: (parseFloat(attraction.lat) + 0.1).toString(),
          },
        },
        {
          long: {
            gte: (parseFloat(attraction.long) - 0.1).toString(),
            lte: (parseFloat(attraction.long) + 0.1).toString(),
          },
        },
      ],
    },
    take: 3,
  });

  return res.status(200).json(closeByListings);
}
