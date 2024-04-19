import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createOrder, deleteOrder, getOrderById, getAllOrders, updatedOrder } from '../controllers/orderController.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { roles } from '../middlewares/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// rotte per oottenere tutti gli oridni 
router.get('/',authorize(roles.USER, roles.ADMIN), getAllOrders)
// Come ottenere oridne per ID
router.get('/:id',authorize(roles.ADMIN), getOrderById)
// crea nuovo ordine
router.post('/addOrder',authorize(roles.USER, roles.EDITOR ) , createOrder );
// Aggiorna ordini esistenti
router.put('/updateOrder',  authorize(roles.USER, roles.EDITOR ) ,updatedOrder); 
// eliminazione di un ordine
router.delete('/:id' ,authorize(roles.USER, roles.EDITOR ) , deleteOrder);

export default router;

