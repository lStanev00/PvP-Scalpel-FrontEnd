import express from "express";
import dotenv from 'dotenv'; dotenv.config({ path: '../.env' });
import { DBconnect } from "./src/helpers/mongoHelper.js";
import router from "./src/router.js";

const app = express();
const port = 59534

await DBconnect();

app.use(express.json({ extended: false}));
app.use(`/`, router);


app.listen(port, console.log(`Server's running at http://localhost:${port}`));