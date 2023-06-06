import prisma from "../libs/prismadb";

export default async function handler(req, res) {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error) {
    throw new Error(error);
  }
}
