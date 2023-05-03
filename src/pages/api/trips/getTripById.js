import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { tripId } = req.body;

  if (!tripId) {
    return res.status(200).json({ error: "Trip ID not provided" });
  }

  let trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: {
      reservations: {
        include: {
          listing: true,
        },
      },
      attractions: true,
      trails: {
        include: {
          locations: true,
        },
      },
    },
  });

  if (!trip) {
    return res.status(200).json({ error: "Trip not found" });
  }

  return res.status(200).json(trip);
}
