import prisma from "../libs/prismadb";

export default async function handler(req, res) {
  try {
    const trails = await prisma.trail.findMany({
      include: {
        locations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeTrails = trails.map((trail) => ({
      ...trail,
      createdAt: trail.createdAt.toISOString(),
    }));

    return safeTrails;
  } catch (error) {
    throw new Error(error);
  }
}
