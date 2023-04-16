import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { email } = req.body;

  console.log(email);

  let currentUser = await prisma.user.findUnique({
    where: {
      email: email,
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

  return res.status(200).json(safeFavorites);
}
