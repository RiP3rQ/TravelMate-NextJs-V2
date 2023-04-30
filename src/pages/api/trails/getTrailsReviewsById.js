import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { trailId } = req.body;

  let Trail_Reviews = await prisma.trail_Review.findMany({
    where: {
      trailId: trailId,
    },
    include: {
      user: true,
    },
  });

  if (!Trail_Reviews || Trail_Reviews.length === 0) {
    return res.status(200).json({ error: "Reviews not found!" });
  }

  Trail_Reviews = Trail_Reviews.map((review) => {
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

  return res.status(200).json(Trail_Reviews);
}
