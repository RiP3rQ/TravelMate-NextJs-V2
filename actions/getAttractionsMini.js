import prisma from "../libs/prismadb";

export default async function handler(req, res) {
  try {
    const attractions = await prisma.attraction.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 9,
    });

    const safeAttractions = attractions.map((attraction) => ({
      ...attraction,
      createdAt: attraction.createdAt.toISOString(),
    }));

    return safeAttractions;
  } catch (error) {
    throw new Error(error);
  }
}
