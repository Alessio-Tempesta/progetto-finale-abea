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
    try {
        const user = await prisma.user.findUnique({ where: { username }});

        if (!user) {
        return res.status(401).json( { error: "credenziali non valide"})
        }
        // confronto tra le password con la pssword messa ene l DB
        const passwordMatch = await bcrypt.compare(password, user.password);

        if( !passwordMatch){
            return res.status(401).json( { error: "credenziali non valide"});    
        }

        // Generazione Token per l'user autenticato
        const token = jwt.sign(
            { userId : user.id, username: user.username, role: user.role},
            'PasswordSegreta123321',
            { expiresIn: '1h'} 
        ) ;
        res,json( { token });
    } catch (error) {
        console.error("Errore durante il login" , error);
        res.status(500).json({ error: "Errore durante il login"})
    }
});

router.get('/profile', (req, res) =>{
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json( { message: "Autenticazione Richiesta"});
        
    }

    try {
        const decodedToken = jwt.verify( token, 'PasswordSegreta123321')

        if(!decodedToken){
            return res.status(401).json( { message: "Token invalido"});
        }

        const username = decodedToken.username;
        res.json( { message: "Benvenuto," + username});
    } catch (error) {
        console.error("Errore durante il recupero del profilo utente:", error);
        res.status(500).json( { error: "Errore durante il recupero del profilo utente:" });
    }
})

export default router;