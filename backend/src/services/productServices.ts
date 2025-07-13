import productModel from "../models/productModel";

export const getAllProducts = async () => {
    return await productModel.find();
};

export const seedInitialProducts = async () => {
    try {
        const products = [
            {
                title: "Test Product1", image: "https://tse3.mm.bing.net/th/id/OIP.Z3Oski-flNQmsc4v4S4cFAHaE9?pid=Api&P=0&h=180", price: 1000, stock: 21
            },
            {
                title: "Test Product2", image: "https://tse3.mm.bing.net/th/id/OIP.3Gy5eKebIrmNWB3wpdOhLAHaFI?pid=Api&P=0&h=180", price: 2000, stock: 12
            },
            {
                title: "Test Product3", image: "https://tse1.mm.bing.net/th/id/OIP.18n-BJ0_rgUmpnIgUXO-gAHaGu?pid=Api&P=0&h=180", price: 3000, stock: 2
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