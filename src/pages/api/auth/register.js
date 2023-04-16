import bcrypt from "bcrypt";

import prisma from "../../../../libs/prismadb";

export default async function handler(req, res) {
  const { email, username: name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return res.status(200).json(user);
}
