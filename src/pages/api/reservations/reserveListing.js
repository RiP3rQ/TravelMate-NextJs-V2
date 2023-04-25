import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { totalPrice, startDate, endDate, listingId, currentUserId } = req.body;
  console.log(req.body);

  if (!totalPrice || !startDate || !endDate || !listingId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Calculate the average rating of the listing based on all reviews
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUserId,
          startDate: startDate,
          endDate: endDate,
          totalPrice: totalPrice,
        },
      },
    },
  });

  return res.status(200).json(listingAndReservation);
}
