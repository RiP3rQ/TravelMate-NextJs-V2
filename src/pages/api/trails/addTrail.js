import prisma from "../../../../libs/prismadb";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  //   const session = await getServerSession(req, res);

  //   if (!session) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }

  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email: session.user.email,
  //     },
  //   });

  //   const trail = await prisma.trail.create({
  //     data: {
  //       title: "Edadwadaw",
  //       description: "g esgsegesgesges",
  //       imageSrc:
  //         "https://res.cloudinary.com/dr3jjyqgi/image/upload/v1681335563/cld-sample-2.jpg",
  //       category: "Miejskie",
  //       locations: {
  //         create: [
  //           { lat: "36.4917", long: "-118.4377" },
  //           { lat: "36.8550", long: "-118.2852" },
  //           { lat: "36.7214", long: "-118.5375" },
  //           { lat: "36.7255", long: "-118.6386" },
  //           { lat: "36.8625", long: "-118.5739" },
  //           { lat: "36.8736", long: "-118.6006" },
  //         ],
  //       },
  //       userId: user.id,
  //     },
  //   });

  return res.status(200).json({ message: "Trail added" });
}
