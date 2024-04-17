import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Rotte per ottenere i prodotti

router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json( products )
    } catch (error) {
        console.error("Errore durante il recuoer dei prodotti", error);
        res.status(500).json({ error: "Errore durante il recupero degli ordini"})
    }
});

// Rotte per ottenere un singolo prodotto id
 router.get('/id', async (req, res ) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where : { id: parseInt(id) }
        })
        if (!product){
            return res.status(404).json({ error: " Prodotto non trovato" });
        }else{
            res.json( product )
        }
    } catch (error) {
        console.error(" Errore duranyte il recupero del prodotto per Id", error);
        res.status(500).json( { error: "Errore duranyte il recupero del prodotto per Id"});
    }
});

// rotte per creare nuovo ordine
router.post('/', async ( req, res ) =>{
    const { name , description, price } = req.body;

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Errore durante la creazione del nuovo prodotto", error);
        res.status(500).json( { error: "errore durante la creazione"})
    }
});

// rotte per aggiornare un prodotto esistente per Id
router.put('/productId', async (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, description, price} = req.body;

    try {
        const updatedProduct = await prisma.product.update({
            where : { id: productId},
            data: { name, description, price}
        })

        res.json(updatedProduct)
    } catch (error) {
        console.error("Errore nell'aggiornamneto del prodotto", error);
        res.status(500).json({ error: "Errore durante l'aggiornamneto prodoto per id" });
    }
});

// rotte per eliminazione prodotto per id 
router.delete('/:id' , async (req , res) => {
    const productId = parseInt(req.params.id);

    try {
        await prisma.product.delete({
            where: { id: productId }
        });

        res.status(204).end();
    } catch (error) {
        console.error("Errore nell'eliminazione prodotto", error);
        res.status(500).json( {error: "errore nella eliminiazione prodotto"} )
    }
})

export default router;