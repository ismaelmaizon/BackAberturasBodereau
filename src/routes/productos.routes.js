import { Router } from "express";
import {
  addImgProducto,
  createProducto,
  deleteImgProducto,
  deleteProducto,
  getProductMostSold,
  getProducto,
  getProductoIms,
  getProductos,
  updateProducto,
} from "../controllers/productos.controller.js";
import __dirname  from '../utils.js'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// carga de imagen
const storage = multer.diskStorage({
  destination: __dirname + '/img',
  filename: function (req, file, cb) {
    cb(null, uuidv4() + file.originalname)
  }
})
const upload = multer({ storage: storage })

// GET todos los /productos
router.get("/productos", getProductos);
// GET un producto
router.get("/producto/:idg", getProducto);
router.get("/productoimg/:idg", getProductoIms);
//GET producto mas vendido
router.get("/productoMostSold", getProductMostSold)
// INSERT un producto
router.post("/producto", upload.single('file') , createProducto);
// INSERT imagen a producto
router.post("/addimgProduct", upload.single('file') , addImgProducto);
//update producto
router.post("/updateProduct", updateProducto);
// DELETE un producto
router.delete("/producto/:id", deleteProducto);
// DELETE imagen de un producto
router.delete("/deleteproductoImg/:id", deleteImgProducto);



// UPDATE un producto

export default router;
