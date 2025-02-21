import express from "express";
import dotenv from 'dotenv'; dotenv.config({ path: '../.env' });
import { DBconnect } from "./helpers/mongoHelper.js";

const app = express();
const port = 59534

await DBconnect();


app.listen(port, console.log(`Server's running at http://localhost:${port}`));