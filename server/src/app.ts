import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";


export const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
