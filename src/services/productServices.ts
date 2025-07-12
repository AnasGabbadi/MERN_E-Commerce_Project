import productModel from "../models/productModel";

export const getAllProducts = async () => {
    return await productModel.find();
};

export const seedInitialProducts = async () => {
    try {
        const products = [
            {
                title: "Test Product", image: "https://i.ebayimg.com/images/g/MbUAAOSwI7ZimiI5/s-l1200.webp", price: 100, stock: 12
            }
        ];

        const existProducts = await getAllProducts();

        if (existProducts.length === 0) {
            await productModel.insertMany(products);
        }
    } catch (error: any) {
        console.error("Error seeding initial products:", error.message);
    }
};