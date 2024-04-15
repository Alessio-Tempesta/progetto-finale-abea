// tutti gli import delle dipendeze
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

// 
const app = express();
const prisma = new PrismaClient();

// middleware 
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: "PasswordSegreta123321",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);

// Midldleware JWT
app.use((req, res, next ) => {
    const token = req.headers('Autorizzazione').authorization?.split(' ')[1] || req.body.token;;

    if( token ) {
        try {
            const decoded = jwt.verify(token , 'PasswordSegreta123321');
            req.user = decoded;
        }catch (error) {
            console.error('errrore durante la verifica del tokoen Jwt,' , error.message);
        }
    }
    next()
});

// Configrazione delle rotte 
app.use('/api/auth', )


