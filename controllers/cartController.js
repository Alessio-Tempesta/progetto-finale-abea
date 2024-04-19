import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// Aggiungi un prodotto al carrello dell'utente autenitcato

export const addToCart = async (req, res ) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        
        // verifcia se il porodotto esiste nel database
        const product = await prisma.product.findUnique({ where : { id: productId}
        });

        if(!product){
            return res.status(404).json({ error: "Prodotto non trovato "});
        }

        // Aggiungere prodotto all'carello del utente 
        const cartItem = await prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
            }
        })

        res.json(cartItem)
    } catch (error) {
        console.error("Errore durante l'aggiunta del prodotto al carello", error);
        res.status(500).json({ error: "Errore durante l'aggiunta del prodotto al carello "})
        
    }
};

export const viewCart = async ( req , res ) => {
    try {
        const userId = req.user.userId;

        const cartItems = await prisma.cartItem.findMany({
            where : {userId},
            include: {
                product: true
            }    
        })

        res.json(cartItems)
    } catch (error) {
        console.error("Errore durante il recuepro del carello utente", error);
        res.status(500).json({ error: "Errore durante il recuepro del carello utente"})
    }
}

export const updateCartItem = async ( req , res ) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        //Verifica se l'elemento del carrello esiste
        const cartItem = await prisma.cartItem.findUnique({
            where : { id: parseInt( cartItemId )},
        });

        if(!cartItem) {
            return res.status(404).json({ error: "elemento del carrello non trovato"});
        }

        // aggiorna la qunaittà dell'elemento del carrello

        const updatedCartItem = await prisma.cartItem.update({
            where : { id: parseInt(cartItemId)},
            data : { quantity },
        });
        res.json({ message: "Quanitità aggiornata con successo ", cartItem: updatedCartItem})
    } catch (error) {
        console.error("errore durante l'aggiornamento della quantità nel carrello ", error);
        res.status(500).json( { error : "Errore durante l'aggiornamneto delle quantità nel carrello"})
    }
};

export const removeCartItem = async (req , res ) => {
    try {
        const { cartItemId } = req.params;
        
        // verficia elemento del carello esiste
        const cartItem = await prisma.cartItem.findUnique({
            where : { id: parseInt(cartItemId)},
    })
    if(!cartItem) {
        return res.status(404).json({ error: "elemento del carello non trovato" })
    }
    // elimina l'elemento del carello
    await prisma.cartItem.delete({
        where : { id: parseInt(cartItemId)},
    });
    res.status(204).end()
    } catch (error) {
        console.error("Errore durante la rimozione del prodotto dal  carello", error);
        res.status(500).json({ error: "Errore durante la rimozione del prodotto dal  carrello "})
    }
};


