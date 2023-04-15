import bcrypt from "bcrypt";

import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  let { newPassword, credentials, email } = req.body;

  const currentUser = await prisma.user.findUnique({
    where: {
      email: email,
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

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: {
      email: currentUser.email,
    },
    data: {
      hashedPassword: hashedNewPassword,
    },
  });

  return res.status(200).json(updatedUser);
}
