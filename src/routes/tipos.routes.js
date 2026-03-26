import { Router } from "express";
import { createTipos, deleteTipos, getTipos } from "../controllers/tipos.controller.js";
import { soloAdmin } from "../controllers/login.controller.js";




const router = Router()
//crear nuevo tipo
router.post('/createTipo', soloAdmin, createTipos)
//obtener tipos
router.get('/getTipos', getTipos)
//obtener tipo
//router.get('/getTipo/:id', )
router.delete('/deleteTipo/:id', soloAdmin, deleteTipos)

export default router