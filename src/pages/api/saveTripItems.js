import prisma from "../../../libs/prismadb";

export default async function handler(req, res) {
  try {
    const { tripId, newItems } = req.body;

    if (!newItems && !tripId) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const trip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        savedItems: {
          push: newItems,
        },
      },
    });
    return res.status(200).json(trip);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
