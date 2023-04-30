import prisma from "../../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { trailId, action } = await req.body;

  if (!trailId || !action) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  let currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  let favoriteTrailsIds = [...(currentUser.favoriteTrailsIds || [])];

  if (action === "like") {
    favoriteTrailsIds.push(trailId);

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteTrailsIds,
      },
    });

    return res.status(200).json(user);
  } else if (action === "unlike") {
    favoriteTrailsIds = favoriteTrailsIds.filter((id) => id !== trailId);

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteTrailsIds,
      },
    });
    return res.status(200).json(user);
  }
}
