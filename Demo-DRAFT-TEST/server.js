import e from "express";
import fs from 'fs';
import {loadBody} from "./pages/src/loadBody.js"; 
const port = 59535;
const app = e();
import rateLimit from "express-rate-limit";

app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 2000, // 1 second
    max: 10, // Max 10 requests per second per IP
    message: "Too many requests, slow down.",
    headers: true,
});

app.use("/", limiter);

app.use((req, res, next) => { // Manual DoS pentest purposes (not storing) 
    console.log("IP:", req.ip, "Real IP:", req.headers["x-forwarded-for"]);
    next();
  });
  

app.disable('x-powered-by');
app.use("/pages", e.static("pages", {
    setHeaders: (res) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
}));

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    next();
});


app.get(`/`, (req, res) => {
    res.send(loadBody(`home`))
});

app.get(`/roster`, (req, res) => {
    res.send(loadBody(`roaster`))
})

app.get(`/leaderboard`, (req, res) => {
    res.send(loadBody(`LDB`))
})

app.get(`/LDB`, async(req, res) =>{
    res.send(JSON.parse(fs.readFileSync(`./pages/DBS/roaster.json`, `utf8`)));
})

app.listen(port, () => {
    console.log(`Server's online and running at http://localhost:${port}`);
    console.log(`and after tunneling at https://www.pvpscalpel.com`);
});