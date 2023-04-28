import prisma from "../../../libs/prismadb";

export default async function handler(req, res) {
  try {
    const { name, page } = req.body;

    if (!name || !page)
      return res.status(400).json({ message: "Missing name or page!" });

    if (page === "Noclegi") {
      const ListingWithNameInName = await prisma.Listing.findMany({
        where: {
          title: {
            contains: name,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      return res.status(200).json(ListingWithNameInName);
    } else if (page == "Atrakcje") {
      const AttractionWithNameInName = await prisma.Attraction.findMany({
        where: {
          title: {
            contains: name,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      return res.status(200).json(AttractionWithNameInName);
    }
  } catch (err) {
    return res.status(400).json({ message: "Not in database!" });
  }
}
