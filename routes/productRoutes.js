import express from 'express'
import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/productControllers.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router  = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById).put(protect,admin,updateProduct)
router.route('/').post(protect,admin,createProduct);

export default router;