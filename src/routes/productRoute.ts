import express, { request, response } from "express";
import { getAllProducts } from "../services/productServices";

const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const products = await getAllProducts();
        response.status(200).send(products);
    } catch (error) {
        response.status(500).send({error: "Internal Server Error"});
    }
})

export default router;