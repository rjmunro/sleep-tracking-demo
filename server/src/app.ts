import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle inserting a user's daily hours
app.post("/api/daily", async (req: Request, res: Response) => {
  const { name, date, hours } = req.body;

  // Basic validation
  if (!name || !date || hours == null) {
    return res
      .status(400)
      .json({ error: "name, date, and hours are required." });
  }

  if (hours > 24) {
    return res
      .status(400)
      .json({ error: "There cannot be more than 24 hours in a day" });
  }

  try {
    // Upsert user and create a daily entry
    const user = await prisma.user.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });

    // Create the daily entry
    const dailyEntry = await prisma.daily.create({
      data: {
        userId: user.id,
        date: date,
        hours: hours,
      },
    });

    // Respond with the created daily entry
    res.status(201).json(dailyEntry);
  } catch (error) {
    console.error("Error inserting daily entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get users and their daily entry count
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    // Query users and count their daily entries
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            dailies: true,
          },
        },
      },
    });

    // Transform the result to include the count in the response
    const result = users.map((user) => ({
      id: user.id,
      name: user.name,
      dailyEntriesCount: user._count.dailies,
    }));

    // Send the response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
