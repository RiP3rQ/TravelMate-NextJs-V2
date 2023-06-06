import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const { email } = req.body;

    console.log(email);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const trips = await prisma.trip.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(trips);
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}
