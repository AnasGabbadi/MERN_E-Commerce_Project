import express, { request, response } from "express";
import { login, register } from "../services/userServices";

const router = express.Router();

router.post('/register', async (request, response) => {
    try {   
        const {userName, email, password} = request.body;
        const {statusCode, data} = await register({userName, email, password});
        response.status(statusCode).send(data);
    } catch (error) {
        response.status(500).send({error: "Internal Server Error"});    
    }
})

router.post('/login', async (request, response) => {
    try {
        const {email, password} = request.body;
        const {statusCode, data} = await login({email, password})
        response.status(statusCode).send(data)
    } catch (error) {
        response.status(500).send({error: "Internal Server Error"});    
    }
})

export default router;