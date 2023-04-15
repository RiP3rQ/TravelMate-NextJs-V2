import bcrypt from "bcrypt";

import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  let { newEmail, oldEmail, name, image, credentials } = req.body;

  const currentUser = await prisma.user.findUnique({
    where: {
      email: oldEmail,
    },
  });

  if (!currentUser || !currentUser?.hashedPassword) {
    throw new Error("Invalid credentials");
  }

  const isCorrectPassword = await bcrypt.compare(
    credentials,
    currentUser.hashedPassword
  );

  if (!isCorrectPassword) {
    throw new Error("Invalid credentials");
  }

  if (!image) {
    image = currentUser.image;
  }
  const updatedUser = await prisma.user.update({
    where: {
      email: currentUser.email,
    },
    data: {
      name: name,
      email: newEmail,
      image: image,
    },
  });

  return res.status(200).json(updatedUser);
}
