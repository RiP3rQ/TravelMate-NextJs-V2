import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { attractionId } = req.body;

  let attraction = await prisma.attraction.findUnique({
    where: {
      id: attractionId,
    },
    include: {
      user: true,
    },
  });

  if (!attraction) {
    return res.status(200).json({ error: "Attraction not found" });
  }

  return res.status(200).json({
    ...attraction,

    createdAt: attraction.createdAt.toString(),
    user: {
      ...attraction.user,
      createdAt: attraction.user.createdAt.toString(),
      updatedAt: attraction.user.updatedAt.toString(),
      emailVerified: attraction.user.emailVerified?.toString() || null,
    },
  });
}
