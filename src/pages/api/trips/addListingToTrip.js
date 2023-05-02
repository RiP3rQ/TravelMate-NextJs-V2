import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { listingId, tripId, page } = req.body;

    if (!listingId && !tripId) {
      return res.status(400).json({ message: "Bad Request" });
    }

    if (page === "Listings") {
      const trip = await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          reservations: {
            connect: {
              id: listingId,
            },
          },
        },
      });
      return res.status(200).json(trip);
    } else if (page === "Attractions") {
      const trip = await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          attractions: {
            connect: {
              id: listingId,
            },
          },
        },
      });
      return res.status(200).json(trip);
    }
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
