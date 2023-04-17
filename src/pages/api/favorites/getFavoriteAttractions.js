import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { email } = req.body;

  let currentUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const favorites = await prisma.attraction.findMany({
    where: {
      id: {
        in: [...(currentUser.favoriteAttractionsIds || [])],
      },
    },
  });

  const safeFavorites = favorites.map((favorite) => ({
    ...favorite,
    createdAt: favorite.createdAt.toString(),
  }));

  return res.status(200).json(safeFavorites);
}
