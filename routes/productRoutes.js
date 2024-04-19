import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { roles } from '../middlewares/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// Rotte per ottenere i prodotti

router.get('/products', getAllProducts);

// Rotte per ottenere un singolo prodotto id
router.get('/product/:id',getProductById );

// rotte per creare nuovo ordine
router.post('/create/newProduct',authorize(roles.ADMIN), createProduct);

// rotte per aggiornare un prodotto esistente per Id
router.put('/update/productId',authorize(roles.ADMIN), updateProduct)

// rotte per eliminazione prodotto per id 
router.delete('/removeProduct/:id', authorize(roles.ADMIN), deleteProduct) 

export default router;