import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { listingId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (listingId) {
      const trip = await prisma.trip.create({
        data: {
          userId: user.id,
          reservations: {
            connect: {
              id: listingId,
            },
          },
        },
        include: {
          reservations: true,
        },
      });
      return res.status(200).json(trip);
    } else {
      const trip = await prisma.trip.create({
        data: {
          userId: user.id,
        },
      });
      return res.status(200).json(trip);
    }
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
