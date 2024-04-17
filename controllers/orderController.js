import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// funzione per creare un nuvo ordine 

export const createOrder = async ( req, res) => {
    const { userId, products } = req.body;

    try {
              // se l'utente è autenticato è un admin
            if( !req.user || req.user.role !== 'admin') {
                return res.status(404).json({ error: "Accesso non autorizzato "})
            }
            // crea ordine nel DB 
            const newOrder = await prisma.order.create({
                data: { 
                    userId,
                    products: { create: products }
                },
                include: {
                    products : true
                }
            });

            res.json(newOrder)
    } catch (error) {
        console.error(" Errore durante la creazione dell'ordine", error);
        res.status(500).json( { error:  "Errore durante la creazione dell'ordine"})
    }
};

// funzione per ottenere tutti gli oridini di un utente 
export const getUsersOrders = async ( req, res ) => {
    const userId = req.user.userId;

    try {
        const userOrders = await prisma.order.findMany({
            where : { userId},
            include: { products : true}
        });
        res.json(userOrders)
    } catch (error) {
        console.error("Errore durante  il recupero degli orindi dell'utente");
        res.status(500).json( { error : "Errore durante  il recupero degli orindi dell'utente"})
    }
};

// funzione per eliminare un ordine solo per Admin

export const deleteOrder = async (req , res ) => {
    const orderId = parseInt(req.params.id);

    try {
        if( !req.user || req.user.role !== 'admin') {
            return res.status(404).json({ error: "Accesso non autorizzato "})
        }
        // elimina l'oridne dal database 
        await prisma.order.delete({
            whwre: { id: orderId}
        });

        res.status(204).end()
    } catch (error) {
        console.error("errore durante l'eliminzaione dell'oridne");
        res.status(500).json( { error : "errore durante l'eliminazione dell'oridne"})
    }
}