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

// Funzione per creare un nuovo prodotto( accessibile solo per gli amministratori )
export const createProduct = async (req, res) => {
    const { name, description, price} = req.body;

    try {
        // se l'utente è autenticato è un admin
        if( req.user.role !== 'admin') {
            return res.status(404).json({ error: "Accesso non autorizzato "})
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price
            },
        });

        res.json(newProduct)
    } catch (error) {
        console.error("Errore durante la creazione del nuovo prodooto");
        res.status(500).json({ error : "Errore durante la creazione del nuovo prodooto" })
    }
}

// funzione per aggiornare un prodotoot esisitente (Admin)
export const updateProduct = async (req, res) => {
    const prodcutId = parseInt(req.params.id);
    const { name, description, price } = req.body;

    try {
        // se l'utente autenticato è un admin 
        if( req.user.role !== 'admin'){
            return res.status(404).json({ error: "Accesso non autorizzato "});
        }
        const updatedProduct = await prisma.product.update({
            where : { id: prodcutId},
            data: { name, description, price }
        })

        res.json(updatedProduct)
    } catch (error) {
        console.error("Errore durante l'aggiornamento del nuovo prodooto", error);
        res.status(500).json({ error : "Errore durante l'aggiornamento del nuovo prodotto" })
    }
}

// funzione per eliminare un prodotto (Admin)

export const deleteProduct = async (req, res) =>{
    const productId = parseInt(req.params.id);

    try {
        if( req.user.role !== 'admin') {
            return res.status(404).json({ error: "Accesso non autorizzato "});
        }
        await prisma.product.delete({
            where : { id: productId }
        });

        res.status(204).end();
    } catch (error) {
        console.error("Errore durante l'eliminazione del nuovo prodooto", error);
        res.status(500).json({ error : "Errore durante l'eliminazione del nuovo prodotto" })
    }
}