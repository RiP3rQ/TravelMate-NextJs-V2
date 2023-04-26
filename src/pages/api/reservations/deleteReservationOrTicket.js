import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { reservationId, ticketId, currentUserId } = req.body;

  console.log(reservationId, ticketId, currentUserId);

  if (reservationId) {
    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [{ userId: currentUserId }, { listing: { userId: currentUserId } }],
      },
    });

    return res.status(200).json(reservation);
  }

  if (ticketId) {
    const ticket = await prisma.Ticket_for_Attraction.deleteMany({
      where: {
        id: ticketId,
        OR: [
          { userId: currentUserId },
          { attraction: { userId: currentUserId } },
        ],
      },
    });

    return res.status(200).json(ticket);
  }

  return res.status(400).json({ message: "Bad request" });
}
