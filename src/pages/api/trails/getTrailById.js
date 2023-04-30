import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { trailId } = req.body;

  let trail = await prisma.trail.findUnique({
    where: {
      id: trailId,
    },
    include: {
      user: true,
      locations: true,
    },
  });

  if (!trail) {
    return res.status(200).json({ error: "Trail not found" });
  }

  return res.status(200).json({
    ...trail,
    createdAt: trail.createdAt.toString(),
    user: {
      ...trail.user,
      createdAt: trail.user.createdAt.toString(),
      updatedAt: trail.user.updatedAt.toString(),
      emailVerified: trail.user.emailVerified?.toString() || null,
    },
  });
}
