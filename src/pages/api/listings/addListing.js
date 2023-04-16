import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const body = await req.body;
  const {
    title,
    description,
    imageSrc,
    type: category,
    roomCount,
    bathroomCount,
    guestCount,
    lat,
    long,
    price,
  } = body;

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (
    !title ||
    !description ||
    !imageSrc ||
    !category ||
    !roomCount ||
    !bathroomCount ||
    !guestCount ||
    !lat ||
    !long ||
    !price
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      lat: String(lat),
      long: String(long),
      price: parseInt(price, 10),
      star: String(0),
      userId: user.id,
    },
  });

  return res.status(200).json(listing);
}
