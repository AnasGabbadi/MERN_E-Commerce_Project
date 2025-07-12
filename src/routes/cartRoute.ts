import express from "express";
import { addItemToCart, checkout, clearCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from "../services/cartServices";
import validateJWT from "../middlewares/validateJWT";
import {ExtendRequest} from "../types/extendedRequest";

const router = express.Router();

router.get('/', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req.user._id;
        const cart = await getActiveCartForUser({userId})
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

router.delete('/', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req.user._id;        
        const response = await clearCart({userId});
        res.status(response.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

router.post('/items', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const {productId, quantity} = req.body;
        const response = await addItemToCart({userId, productId, quantity});
        res.status(response.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

router.put('/items', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const {productId, quantity} = req.body;
        const response = await updateItemInCart({userId, productId, quantity});
        res.status(response.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

router.delete('/items/:productId', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const {productId} = req.params;
        const response = await deleteItemInCart({userId, productId});
        res.status(response.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

router.post('/checkout', validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const {address} = req.body;
        const response = await checkout({userId, address});
        res.status(response.statusCode).send(response.data);
    } catch (error) {
        res.status(500).send({error: "Internal Server Error"});
    }
});

export default router;