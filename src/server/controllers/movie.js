const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET_KEY;

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany();
    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;
    // below: .split method outputs an [array], the (" ") tell it to split at the gap between 'BEARER' and the token
    const [_, token] = req.get("Authorization").split(" ");
    // const token = req.get("Authorization")
    // console.log(title, description, runtimeMins);
    console.log("Create Movie Token", token);
    
    // below: verifies the token with the server, checking the user is logged in before so they can create a new entry
    try {
        jwt.verify(token, jwtSecret)
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token provided.' })
    }

    const createdMovie = await prisma.movie.create({
      data: {
        title: title,
        description: description,
        runtimeMins: runtimeMins,
      },
    });
    console.log("createdMovie", createdMovie);
    res.status(201).json({ data: createdMovie });
};

module.exports = {
    getAllMovies,
    createMovie
};