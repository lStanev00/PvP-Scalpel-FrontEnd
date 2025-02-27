import express from "express";
import dotenv from 'dotenv'; dotenv.config({ path: '../.env' });
import { DBconnect } from "./src/helpers/mongoHelper.js";
import router from "./src/router.js";
import cors from 'cors'

const app = express();
const port = 59534;

await DBconnect();
const allowedOrigins = [
    "https://www.pvpscalpel.com",
    "https://api.pvpscalpel.com",
    "http://localhost:5173"
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  }));
app.use(express.json({ extended: false }));
app.use(`/`, router);


app.listen(port, console.log(`Server's running at http://localhost:${port}`));