import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, authorId } = req.body;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.authorId = authorId;
    }

    const tickets = await prisma.Ticket_for_Attraction.findMany({
      where: query,
      include: {
        attraction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeTickets = tickets.map((ticket) => {
      return {
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        attraction: {
          ...ticket.attraction,
          createdAt: ticket.attraction.createdAt.toISOString(),
        },
      };
    });

    return res.status(200).json(safeTickets);
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}
