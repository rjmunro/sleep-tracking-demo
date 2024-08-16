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
