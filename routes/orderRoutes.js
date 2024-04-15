import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// rotte per oottenere tutti gli oridni 

router.get('/', async (req , res) => {
    try {
        const orders = await prisma.order.findMany();
        res.json( orders );
    } catch (error) {
        console.error("Errore durante il recuper degli ordini ", error);;
        res.status(500).json( { message: "Errore durante il recupero ordini"})
    }
});

// Come ottenere oridne per ID
router.get('/id', async ( req , res) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where :{ id : parseInt(id) }
        });
        if( !order){
            res.status(401).json({ error: "Ordine non trovato" });
        }else{
            res.json(order)
        }
    } catch (error) {
        console.error("Errore durante il recupeor oridine ");
        res.status(500).json( { message : "errore durante il recuper dell'ordine"});
    };
})

// crea nuovo ordine
router.post('/', async (req, res) =>{
    const { productId, quantity, customerId} = req.body;
    try {
        const newOrder = await prisma.order.create({
            data: {
                product: { connect: { id: productId}},
                customer: { connect: { id: customerId}},
                quantity
            }
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Errore durante la creazione dell'nuovo ordine", error),
        res.status(500).json({ error: "errore durante la creazione dell' ordine "})
    }
});

// Aggiorna ordini esistenti
router.put('/:id', async( req, res ) =>{
    const { id } = req.params;
    const { quantity } = req.body;
    try{
        const updatedOrder = await prisma.order.update({
            where : { id: parseInt(id) },
            data: { quantity }
        });
        res.json(updatedOrder);
    }catch (error){
        console.error("Errore durante l'aggiornamneto dell' ordine", error);
        res.status(500).json( { error: "Errore durante l'aggiornamento dell'ordine"})
    }
});

// eliminazione di un ordine

router.delete('/id' , async ( req, res) => {
    const { id }= req.params;
    try {
        await prisma.order.delete( { where: { id: parseInt(id)}});
        res.json ( { message: "ordiene eliminato corretamente"});
    } catch (error) {
    console.error("errore durante l'eliminazione dell'ordine", error);
    res.status(500).json( { error: "erorre durante l'eliminazione dell'oridne "})
    }
});

export default router;

