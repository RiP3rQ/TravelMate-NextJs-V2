import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { attractionId } = req.body;

  let Attraction_Reviews = await prisma.Attraction_Review.findMany({
    where: {
      attractionId: attractionId,
    },
    include: {
      user: true,
    },
  });

  if (!Attraction_Reviews || Attraction_Reviews.length === 0) {
    return res.status(200).json({ error: "Reviews not found!" });
  }

  Attraction_Reviews = Attraction_Reviews.map((review) => {
    return {
      ...review,
      createdAt: review.createdAt.toString(),
      user: {
        ...review.user,
        createdAt: review.user.createdAt.toString(),
        updatedAt: review.user.updatedAt.toString(),
        emailVerified: review.user.emailVerified?.toString() || null,
      },
    };
  });

  return res.status(200).json(Attraction_Reviews);
}
