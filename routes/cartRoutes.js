import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Aggiungi un prodotto al carrello dell'utente autenitcato
router.post('/cart/add', async (req, res ) => {
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
});

// Endpoitn per ottenere il carello dell'utente autenticato
router.get('/cart', async ( req, res) => {
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
})

// Rimozione prodotto dal carello dall'utente autenticato
router.delete('/cart/remove/:cartItemId', async ( req ,res ) => {
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
})

export default router;