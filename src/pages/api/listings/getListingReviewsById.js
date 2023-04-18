import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { listingId } = req.body;

  let Listing_Reviews = await prisma.Listing_Review.findMany({
    where: {
      listingId: listingId,
    },
    include: {
      user: true,
    },
  });

  if (!Listing_Reviews || Listing_Reviews.length === 0) {
    return res.status(200).json({ error: "Reviews not found!" });
  }

  Listing_Reviews = Listing_Reviews.map((review) => {
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

  return res.status(200).json(Listing_Reviews);
}
