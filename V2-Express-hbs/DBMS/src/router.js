import { Router } from "express";
import memberCtrl from "./controllers/memberCtrl.js";

const router = Router();

// router.use(`*`, (req,res, next) => {console.log(`ROUTING`); next()});

router.use(`/`, memberCtrl)

export default router