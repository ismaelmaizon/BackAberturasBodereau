import { Router } from "express";

import { createLugar, deleteLugar, getLugares } from "../controllers/lugares.controller.js";
import { soloAdmin } from "../controllers/login.controller.js";

const router = Router();

// GET lugares
router.get("/lugares", getLugares);
// CREATE lugares
router.post("/lugares", soloAdmin, createLugar);
// Elimnar Lugar
router.delete("/lugares/:id", soloAdmin, deleteLugar);


export default router;
