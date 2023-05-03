import prisma from "../../../libs/prismadb";

export default async function handler(req, res) {
  try {
    const { tripId, item } = req.body;

    console.log(tripId);
    console.log(item);

    const tripSavedItems = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      select: {
        savedItems: true,
      },
    });

    const tripData = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        savedItems: {
          set: tripSavedItems.savedItems.filter(
            (savedItem) => savedItem !== item
          ),
        },
      },
    });

    return res.status(200).json(tripData);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
