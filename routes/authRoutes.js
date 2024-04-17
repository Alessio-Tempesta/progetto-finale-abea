import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 

const router = express.Router()
const prisma = new PrismaClient()

router.post('/register', async ( req , res) =>{
    const { username, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique( { where : { username }});
        if( existingUser ){
            return res.status(409).json( { error : "Username già in uso" });
        }

        const hasedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create ({
            data : { username, password: hasedPassword, role: 'User'},
        })
        const token = jwt.sign( 
            { userId : newUser.id, username : newUser.username, role: newUser.role},
            'PasswordSegreta123321',
            {expiresIn: '1h'}
        );

        res.json( { token })
    } catch (error) {
        console.error("Errore durante la creazione dell'utente", error );
        res.status(500).json( { message : "Errore durante la creazione dell'utente"})
    }
} )

// Da rivedere rotta login 

router.post('/login' , async (req, res) =>{
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