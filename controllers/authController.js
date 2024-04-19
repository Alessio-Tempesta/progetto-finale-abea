import jwt from 'jsonwebtoken';

import  { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


 export const setCookieAfterLogin = ( res ,userId, username, role) => {
    const token = jwt.sign(
        {userId, username, role},
        'PasswordSegreta123321',
        {expiresIn : '1h'}
    )

    res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000});
}

export const alsoAuthorize = (requiredRole) => {
    return ( req, res, next) => {
        const userRole = req.user.role;
        
        if( userRole !== requiredRole ) {
            return res.status(403).json( { error : "Accesso non autorizzato"})
        }
        // Se l'utente ha il suo ruoolo
        next();
    }
}

// funzione per registratre un nuovo utente 

export const registerUser = async ( req, res) => {
    const { username, password, role } = req.body;

    try {
        // verifica se l'utente esiste già 
        const existingUser = await prisma.user.findUnique({ where : { username }});
        if( existingUser) {
            return res.status(409).json( { error: "username gia in uso "})
        }

        // crea un nuovo user nel Db 
        const newUser = await prisma.user.create({
            data: { username , password, role: role ||'User'}
        });

        setCookieAfterLogin(res, newUser.id, newUser.username, newUser.role);

        res.status(201).json( { message : "Utente registaro con successo ", user: newUser});
    } catch (error) {
        console.error("Errore durante le regitsrazione dell'utente" , error);
        res.status(500).json( { error:"Errore durante le regitsrazione dell'utente" });
        
    }
}

// funzione per fare il login 
export const loginUser = async ( req, res ) => {
    const { username , password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where : { username }
        });
        if( !user || user.password !== password) {
            return res.status(404).json( { error : "Credienzaili non valide " });
        }

        setCookieAfterLogin(res, user.id, user.username, user.role)

        res.json( { message: "Login effettuato con successo", user });
    } catch (error) {
        console.error("errore durante il login :" , error);
        res.status(500).json({ error: "Errore durante il login "})
    }
};

// funzione per ottenere il profilo user
export const getUserProfile = async (req , res) => {
    const userId = req.user.userId;
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json( { message: "Autenticazione Richiesta"}); 
    }

    // trovare utene nel db per id
    try {
        const user = await prisma.user.findUnique({
            where : { id: userId }
        }) 

        // verificare se l'utente esiste 
        if( !user) {
            return res.status(404).json( { error : "Utente non trovato" });
        }
        const decodedToken = jwt.verify( token, 'PasswordSegreta123321')
        
        // verifica se l'autorizzazione e basata sul ruolo
        if (!decodedToken || decodedToken.userId !== userId){
            return res.status(401).json( { message : "Token non valido o utnete non autoirzzato"})
        }
        const userProfile = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        if( user.role === "Admin"){
            return res.json(userProfile);
        }
        res.json(userProfile)
    } catch (error) {
        console.error(" Errore durante il recupero del profilo utente ");
        res.status(500).json( { error : " Errore durante il recupero del profilo utente "})
    }
}