import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const trips = await prisma.trip.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeTrips = trips.map((trips) => {
      return {
        ...trips,
        createdAt: trips.createdAt.toISOString(),
      };
    });

    return res.status(200).json(safeTrips);
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}
