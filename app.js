// tutti gli import delle dipendeze
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes  from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { authToken } from './middlewares/authMiddleware.js';
import { authorize } from './middlewares/roleMiddleware.js';
import { assignUserRole } from './controllers/userController.js';
import { roles } from './middlewares/authMiddleware.js';

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
        cookie: { secure: false }
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

//Middleware per l'auteniticazione
app.use(authToken);
app.use(authorize)

// rotta per assengare un ruolo a un utente (solo se è un admin)
app.use('/admin/users/:userId/role', authorize(roles.ADMIN), assignUserRole );
app.use('/editor/users', authorize(roles.EDITOR), assignUserRole);
app.use('/users/user', authorize(roles.USER), assignUserRole);

// Configrazione delle rotte Prodotti
app.use('/product',productRoutes);
// rotta per Autenticazione
app.use('/auth', authRoutes);
// rotta per gli ordini
app.use('/order', orderRoutes);
// rotta per gli utenti o user
app.use('/user', userRoutes)
// rotta per il carrello
app.use('/cart', cartRoutes)



app.listen( 3000 , ()=> {
    console.log("Server in funzione all aporta 3000")
})