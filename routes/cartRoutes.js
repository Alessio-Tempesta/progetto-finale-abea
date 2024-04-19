import express from 'express';
import { PrismaClient } from '@prisma/client';
import { addToCart, removeCartItem, updateCartItem, viewCart } from '../controllers/cartController.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { roles } from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Aggiungi un prodotto al carrello dell'utente autenitcato
router.post('/cart/add',authorize(roles.USER, roles.ADMIN), addToCart);

// Endpoitn per ottenere il carello dell'utente 
router.get('/cart', authorize(roles.USER, roles.ADMIN) ,viewCart)

// Aggiornamento della qunaiutità di un prodotto nel carrello dell'utente autenitcato
router.get('/cart/update/:cartItemId',authorize(roles.USER, roles.ADMIN), updateCartItem)

// Rimozione prodotto dal carello dall'utente autenticato
router.delete('/cart/remove/:cartItemId',authorize(roles.USER, roles.ADMIN), removeCartItem)

export default router;
