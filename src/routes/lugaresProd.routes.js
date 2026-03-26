import { Router } from "express";
import { addproductolugar, deleteproductolugar, getProductosLugar, getUbicacionProducto, updateproductolugar, upDateStockProducto } from "../controllers/lugaresProd.controller.js";
import { soloAdmin } from "../controllers/login.controller.js";




const router = Router()




router.get("/getUbicacionProducto/:idg", getUbicacionProducto)
router.get("/getProductosLugar/:idl", getProductosLugar);
router.put("/upDateStockProducto/:idg", soloAdmin, upDateStockProducto)


router.post("/addProductoLugar/:idg", soloAdmin, addproductolugar)
router.post("/updateProductoLugar/:idg", soloAdmin, updateproductolugar)
router.post("/deleteProductoLugar/:id", soloAdmin, deleteproductolugar)



export default router