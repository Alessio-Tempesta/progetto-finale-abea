import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient()