import { Router } from "express";
import { createEstado, getEstados } from "../controllers/estados.controller.js";
import { soloAdmin } from "../controllers/login.controller.js";


const router = Router()
//registrar estado
router.post('/createEstado', soloAdmin, createEstado)
//obtener estados
router.get('/getEstados', getEstados)
export default router