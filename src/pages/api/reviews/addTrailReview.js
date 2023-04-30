import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { rating, title, description, imageSrc, trailId } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!rating || !title || !description || !trailId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create a new review for the given listing with the given rating
  const review = await prisma.Trail_Review.create({
    data: {
      star: rating.toString(),
      title,
      imageSrc,
      description,
      userId: user.id,
      trailId,
    },
  });

  // Calculate the average rating of the listing based on all reviews
  const reviews = await prisma.Trail_Review.findMany({
    where: {
      trailId: trailId,
    },
    select: {
      star: true,
    },
  });

  console.log("reviews", reviews);

  // all ratings
  const totalRatings = reviews.reduce((acc, attraction) => {
    const rating = parseFloat(attraction.star);
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
  await prisma.trail.update({
    where: {
      id: trailId,
    },
    data: {
      star: averageRating,
    },
  });

  return res.status(200).json(review);
}
