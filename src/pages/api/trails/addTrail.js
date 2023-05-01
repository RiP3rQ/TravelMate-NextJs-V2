import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      imageSrc,
      type: category,
      locations,
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
      locations.length < 1
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let trail;

    trail = await prisma.trail.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        userId: user.id,
        star: String(0),
      },
    });
    for (let i = 0; i < locations.length; i++) {
      const location = await prisma.location.create({
        data: {
          lat: String(locations[i].lat),
          long: String(locations[i].long),
          trail: {
            connect: {
              id: trail.id,
            },
          },
        },
      });
    }

    return res.status(200).json(trail);
  } catch {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
