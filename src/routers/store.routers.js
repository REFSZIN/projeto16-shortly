import express from 'express';
import {listProducts,sendToCart,listCart,checkouts,postCheckout,deleteInMyCart} from "../controllers/storeControllers.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/products', listProducts);
router.post('/carts', sendToCart);
router.get('/mycart', listCart );
router.delete('/mycart/:ID', deleteInMyCart );
router.post('/checkout', authMiddleware, postCheckout );
router.get('/checkout', authMiddleware, checkouts);

export default router;