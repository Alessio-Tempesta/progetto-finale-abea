import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Funzione per ottenere tutti i prodotti

export const getAllProducts = async ( req , res )=> {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        console.error("Erroure durante il recupero dei prodotti", error);
        res.status(500).json({ error : "Erroure durante il recupero dei prodotti"})
    }
};

// Funzione per ottenere il prodotto per ID

export const getProductById = async (req , res) => {
    const { id } = req.parmas;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt( id )}
        });

        if (!product){
            return res.status(404).json( { error: " Errore durante il recpero del prodotto per id"})

        }
        res.json( product )
    } catch (error) {
        console.error(" Errore durante il recpero del prodotto per id", error);
        res.status(500).json( { error:  "Errore durante il recpero del prodotto per id"})
    }
}

