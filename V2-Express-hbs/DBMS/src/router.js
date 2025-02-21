import { Router } from "express";

const router = Router();

router.use(`*`, (req,res) => {console.log(`ROUTING`); res.status(201).json({msg:`ROUTING`})});

export default router