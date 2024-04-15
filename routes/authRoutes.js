import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router()
const prisma = new PrismaClient()

router.post('/login' , (req, res) =>{
    const { username, password } = req.body;
    if ( username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, 'PasswordSegreta123321', { expiresIn: '1h'});
        res.json( { token} ); 
    }else {
        res.status(401).json({ error : "Credenziali non valide"})
    }
});

router.get('/profile', (req, res) =>{
    if(req.user){
        res.json( { message: "benvenuto:" + req.user.username + "!"})
    }else{
        res.status(401).json({ message : "Autenticazione richiesta" });
    }
})

export default router;