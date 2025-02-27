import { Router } from "express";
import memberCtrl from "./controllers/memberCtrl.js";
import LDBController from "./controllers/LDBController.js";

const router = Router();

// router.use(`*`, (req,res, next) => {console.log(`ROUTING`); next()});

router.use(`/`, memberCtrl);
router.use(`/`, LDBController);

export default router