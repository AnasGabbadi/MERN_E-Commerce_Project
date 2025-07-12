import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productServices";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";

const app = express()
const port = 3001;

app.use(express.json())

mongoose
		.connect('mongodb://127.0.0.1:27017/gamatel')
		.then(() => console.log('Gamatel data base Connected!'))
		.catch((err) => console.log('Gamatel data base failed to connect!', err));

// seed initial products
seedInitialProducts();
	
app.use('/user', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute);

app.listen(port, () => {
	console.log(`Server is running at: http://localhost:${port}`);
});

	
