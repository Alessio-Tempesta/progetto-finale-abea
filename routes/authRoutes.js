import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import { getUserProfile, loginUser, registerUser } from '../controllers/authController.js';

const router = express.Router()
const prisma = new PrismaClient()

// rotta register
router.post('/register',registerUser);

//  rotta login 
router.post('/login' ,loginUser);

// rotta profilo
router.get('/profile',getUserProfile )

export default router;