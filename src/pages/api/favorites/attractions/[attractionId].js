import prisma from "../../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { attractionId, action } = await req.body;

  if (!attractionId || !action) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  let currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  let favoriteAttractionsIds = [...(currentUser.favoriteAttractionsIds || [])];

  if (action === "like") {
    favoriteAttractionsIds.push(attractionId);

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteAttractionsIds,
      },
    });

    return res.status(200).json(user);
  } else if (action === "unlike") {
    favoriteAttractionsIds = favoriteAttractionsIds.filter(
      (id) => id !== attractionId
    );

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteAttractionsIds,
      },
    });
    return res.status(200).json(user);
  }
}
