import jwt from 'jsonwebtoken';
import  { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

// funzione per fare il login 
export const loginUser = async ( req, res ) => {
    const { username , password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where : { username }
        });
        if( !user ) {
            return res.status(404).json( { error : "Utente non trovato" });
        }
        // Se la password è corretta
        if( user.password !== password){
            return res.status(401).json({ error: "password o credenziali non valide" });
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