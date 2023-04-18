import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { rating, title, description, imageSrc, listingId } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!rating || !title || !description || !listingId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new review for the given listing with the given rating
  const review = await prisma.Listing_Review.create({
    data: {
      star: rating.toString(),
      title,
      imageSrc,
      description,
      userId: user.id,
      listingId,
    },
  });

  // Calculate the average rating of the listing based on all reviews
  const reviews = await prisma.Listing_Review.findMany({
    where: {
      listingId: listingId,
    },
    select: {
      star: true,
    },
  });

  console.log("reviews", reviews);

  // all ratings
  const totalRatings = reviews.reduce((acc, listing) => {
    const rating = parseFloat(listing.star);
    if (!isNaN(rating)) {
      acc += rating;
    }
    return acc;
  }, 0);

  console.log("totalRatings", totalRatings);

  // average rating
  const averageRating = (totalRatings / reviews.length).toFixed(1).toString();

  console.log("averageRating", averageRating);

  // Update the rating field of the listing with the calculated average rating
  await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      star: averageRating,
    },
  });

  return res.status(200).json(review);
}
