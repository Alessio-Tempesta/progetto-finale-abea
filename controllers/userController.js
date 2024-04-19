import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

// Funzione per assegnare un ruolo a un utente 

export const assignUserRole = async ( req, res ) => {
    const userId = parseInt(req.params.userId);
    const { role } = req.body;

    try {
        const user = await prisma.user.findUnique({ 
            where : {id : userId}
        });

        if( !user ) {
            return res.status(404).json( { error: "Utente non trovato" })
        }

        const updatedUser = await prisma.user.update({
            where : { id: userId},
            data: { role } 
        }) ;

        res.json( { message: "Ruolo aggiornato con successo ", user: updatedUser});
    } catch (error) {
        console.error("Errore durante l'assegnazione deò ruolo", error );
        res.status(500).json( { error: "errorre durantte l'assegnazione del ruolo "})
    }
}


export const createUser = async ( req, res ) => {
    const { username , password, role } = req.body;

    // se l'utente esiste già
    try {
        const existingUser = await prisma.user.findUnique( { where: { username }});
        if (existingUser){
            return res.status(409).json({ error: "Username già in uso " });
        }

        //Crittograga la passord prime di salvaraòe nel db
        const hashedPassword = await bcrypt.hash(password, 10);
        // crea un nuovo utente nel DB

        const newUser = await prisma.user.create({
            data: { username, password: hashedPassword, role}
        });

        setCookieAfterLogin( { userId: newUser.id, username: newUser.username, role: newUser.role})

        res.json( { message: "Utente creato con successo", user: newUser})

    } catch (error) {
        console.error("Errore durante la creazione dell'utente", error);
        res.status(500).json( { message : "Errore durante la creazione dell'utente"})
    }
};

export const getUserById = async ( req , res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({ where : { id: userId }});
        if(!user) {
            return res.status(404).json( { error: "Utente non trovato "});
        }
        res.json(user)
    } catch (error) {
        console.error("Errore durante il recupero dell' utente", error );
        res.status(500).json( { error : "Errore durante il recupero dell'utente "})
    }
};


// Aggiornare le informazioni di un utente
export const updateUser = async ( req, res ) => {
    const userId = parseInt(req.params.id);
    const { username, password, role } = req.body;

    try {
        // Hash della nuova password 
        let updatedUserData = { username, role };
        if ( password ){
            const hashedPassword = await bcrypt.hash(password, 10 )
            updatedUserData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where :{ id: userId },
            data: updatedUserData
        })
        res.json(updatedUser)
    } catch (error) {
        console.error("Errore durante l'aggiornamento dell'utente", error );
        res.status(500).json( { error : "Errore durante l'aggionamento dell'utente  "})
    }
}

// Funzione per eliminare un utnete
export const deleteUser = async ( req ,res ) =>{
    const userId = parseInt(req.params.id);

    try {
        await prisma.user.delete({where : { id:userId }});
        res.status(204).end();
    } catch (error) {
        console.error("Errore durante l'eliminazione dell'utente", error );
        res.status(500).json( { error : "Errore durante l'eliminazione dell'utente  "})
    }
} 