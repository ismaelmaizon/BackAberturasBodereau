import { Router } from "express";
import { autenticacion, login, logout, reg, soloAdmin } from "../controllers/login.controller.js";

const router = Router();

// registrar usuario
router.post("/reg", autenticacion, soloAdmin, reg);

// login
router.post("/log", login);

// logout
router.post("/logout", logout);

export default router;