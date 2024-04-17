import jwt from 'jsonwebtoken';
import  { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export const authorize = (requiredRole) => {
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
        res.json(newUser)

        res.status(201).json( { message : "Utente registaro con successo "});
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
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            'PasswordSegreta123321',
            { expiresIn : '1h' }
        );
        res.json( { token });
    } catch (error) {
        console.error("errore durante il login :" , error);
        res.status(500).json({ error: "Errore durante il login "})
    }
};

// funzione per ottenere il profilo user
 export const getUserProfile = async (req , res) => {
    const userId = req.user.userId;

    // trovare utene nel db per id
    try {
        const user = await prisma.user.findUnique({
            where : { id: userId }
        }) 

        // verificare se l'utente esiste 
        if( !user) {
            return res.status(404).json( { error : "Utente non trovato" });
        }
        // verifica se l'autorizzazione e basata sul ruolo
        if ( user.role !== "Admin"){
            const userProfile = {
                id: user.id,
                username: user.username,
                role: user.role
            };
            return res.json(userProfile)
        }
        // invece se l'utente è un amministratore
        res.json(user);
    } catch (error) {
        console.error(" Errore durante il recupero del profilo utente ");
        res.status(500).json( { error : " Errore durante il recupero del profilo utente "})
    }
}