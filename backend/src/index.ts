import dotenv from "dotenv"; // Load environment variables from .env file
import express from "express"; // Import express for creating the server
import mongoose from "mongoose"; // Import mongoose for MongoDB interactions
import userRoute from "./routes/userRoute"; // Import user routes for handling user-related requests
import { seedInitialProducts } from "./services/productServices"; // Import function to seed initial products
import productRoute from "./routes/productRoute"; // Import product routes for handling product-related requests
import cartRoute from "./routes/cartRoute"; // Import cart routes for handling cart-related requests
import cors from "cors"; // Import CORS middleware for handling cross-origin requests

dotenv.config(); // Load environment variables from .env file

const app = express()
const port = 3001;

app.use(express.json())
app.use(cors()); // Use CORS middleware to allow cross-origin requests

mongoose
		.connect(process.env.DATABASE_URL || "")
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

	
