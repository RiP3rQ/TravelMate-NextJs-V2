import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { listingId, action } = await req.body;

  if (!listingId || !action) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  let currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  let favoriteIds = [...(currentUser.favoriteIds || [])];

  if (action === "like") {
    favoriteIds.push(listingId);

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteIds,
      },
    });

    return res.status(200).json(user);
  } else if (action === "unlike") {
    favoriteIds = favoriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        favoriteIds,
      },
    });
    return res.status(200).json(user);
  }
}
