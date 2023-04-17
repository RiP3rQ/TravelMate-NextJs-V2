import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { listingId } = req.body;

  let listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      user: true,
    },
  });

  if (!listing) {
    return res.status(200).json({ error: "Listing not found" });
  }

  return res.status(200).json({
    ...listing,
    createdAt: listing.createdAt.toString(),
    user: {
      ...listing.user,
      createdAt: listing.user.createdAt.toString(),
      updatedAt: listing.user.updatedAt.toString(),
      emailVerified: listing.user.emailVerified?.toString() || null,
    },
  });
}
