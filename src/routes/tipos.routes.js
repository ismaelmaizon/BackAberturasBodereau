import { Router } from "express";
import { createTipos, deleteTipos, getTipos } from "../controllers/tipos.controller.js";




const router = Router()
//crear nuevo tipo
router.post('/createTipo', createTipos)
//obtener tipos
router.get('/getTipos', getTipos)
//obtener tipo
//router.get('/getTipo/:id', )
router.delete('/deleteTipo/:id', deleteTipos)

export default router