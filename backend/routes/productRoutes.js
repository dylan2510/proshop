import express from 'express';
import {getProducts, getProductById, deleteProduct, 
    createProduct, updateProduct,createProductReview,
    getTopProducts} 
    from "../controllers/productController.js";
import {protect, admin} from "../middleware/authMiddleware.js"; 

const router = express.Router();

// @route   /api/products
// @access  Public
router.route("/")
    .get(getProducts)
    .post(protect,admin,createProduct);

router.route("/:id/reviews")
    .post(protect,createProductReview);

router.get('/top', getTopProducts);

// @route   /api/products/:id
// @access  Public
router.route("/:id")
    .get(getProductById)
    .delete(protect,admin,deleteProduct)
    .put(protect,admin,updateProduct);

export default router;