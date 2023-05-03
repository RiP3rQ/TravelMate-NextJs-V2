import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  try {
    const { tripId, tripName } = req.body;

    if (!tripId || !tripName)
      return res.status(400).json({ message: "Something went wrong!" });

    const trip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        name: tripName,
      },
    });

    return res.status(200).json(trip);
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}
