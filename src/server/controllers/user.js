const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET_KEY

const register = async (req, res) => {
  // Insomnia http://www.localhost:4000/user/register
  const saltRounds = 10;
  const { username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, saltRounds);

  const createdUser = await prisma.user.create({
    data: {
      username: username,
      password: hashPassword,
    },
  });
  console.log("createdUser", createdUser);
  res.status(201).json({ user: username, id: createdUser.id});
};

const login = async (req, res) => {
  // Insomnia http://www.localhost:4000/user/login
  const { username, password } = req.body;

  const foundUser = await prisma.user.findUnique({
    where: { username: username },
  });
  if (!foundUser) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const passwordsMatch = await bcrypt.compare(password, foundUser.password);
  if (!passwordsMatch) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, jwtSecret);
  console.log("Server Login Token", token);

  res.status(201).json({ token });
};

module.exports = {
    register,
    login
};