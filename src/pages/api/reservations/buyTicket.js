import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { price, attractionId, currentUserId } = req.body;
  console.log(req.body);

  if (!price || !attractionId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Calculate the average rating of the listing based on all reviews
  const boughtTicket = await prisma.Ticket_for_Attraction.create({
    data: {
      attractionId: attractionId,
      userId: currentUserId,
      price: parseInt(price, 10),
    },
  });

  return res.status(200).json(boughtTicket);
}
