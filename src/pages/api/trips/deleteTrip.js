import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const trip = await prisma.trip.delete({
      where: {
        id: tripId,
      },
    });
    return res.status(200).json(trip);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
