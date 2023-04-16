import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(200).json({ message: "Not logged In!" });
  }

  let currentUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const favorites = await prisma.listing.findMany({
    where: {
      id: {
        in: [...(currentUser.favoriteIds || [])],
      },
    },
  });

  const safeFavorites = favorites.map((favorite) => ({
    ...favorite,
    createdAt: favorite.createdAt.toString(),
  }));

  res.status(200).json(safeFavorites);
}
