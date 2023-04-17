import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    title,
    description,
    imageSrc,
    type: category,
    lat,
    long,
    paid,
    price,
  } = req.body;

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
    !lat ||
    !long ||
    paid === null ||
    !price
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (paid === true) {
    const attraction = await prisma.attraction.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        lat: String(lat),
        long: String(long),
        userId: user.id,
        paid: Boolean(paid),
        price: parseInt(price, 10),
        star: String(0),
      },
    });
    return res.status(200).json(attraction);
  } else if (paid === false) {
    const attraction = await prisma.attraction.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        lat: String(lat),
        long: String(long),
        userId: user.id,
        paid: Boolean(paid),
        star: String(0),
      },
    });
    return res.status(200).json(attraction);
  } else {
    return res.status(400).json({ message: "Something went wrong!" });
  }
}
