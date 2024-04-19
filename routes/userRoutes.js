import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { alsoAuthorize, } from '../controllers/authController.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { roles } from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// Rotte per la gestione degli utenti 

router.post('/', createUser);
router.get('/:id',authorize(roles.ADMIN), getUserById);
router.put('/:id', authorize(roles.ADMIN), updateUser);
router.delete('/:id', authorize(roles.ADMIN), deleteUser);

export default router;