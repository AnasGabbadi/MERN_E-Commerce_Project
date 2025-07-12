import { cartModel, ICart, ICartItem } from "../models/cartModel";
import { IOrderItem } from "../models/orderModel";
import productModel from "../models/productModel";
import orderModel from "../models/orderModel";

interface ICreateCartForUser {
    userId: String;
}

const CreateCartForUser = async ({userId}: ICreateCartForUser) => {
    try {
        const cart = await cartModel.create({userId, totalAmount: 0});
        await cart.save();
        return cart;
    } catch (error) {
        console.error("Error in CreateCartForUser:", error);
        throw error;
    }
};

interface IGetActiveCartForUser {
    userId: string;
}

export const getActiveCartForUser = async ({userId}: IGetActiveCartForUser) => {
    try {
        let cart = await cartModel.findOne({userId, status: "active"});
        if (!cart) {
            cart = await CreateCartForUser({userId});
        }
        return cart;
    } catch (error) {
        console.error("Error in getActiveCartForUser:", error);
        throw error;
    }
};

interface ClearCart {
    userId: string;     
}

export const clearCart = async ({userId}: ClearCart) => {
    try {
        const cart = await getActiveCartForUser({userId});
        cart.items = [];
        cart.totalAmount = 0;
        const updatedCart = await cart.save();
        return {data: updatedCart, statusCode: 200};
    } catch (error) {
        console.error("Error in clearCart:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

interface AddItemToCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const addItemToCart = async ({productId, quantity, userId}: AddItemToCart) => {
    try {
        const cart = await getActiveCartForUser({userId});
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (existsInCart) return {data: "Item already exists in cart!", statusCode: 400};

        const product = await productModel.findById(productId);
        if (!product) return {data: "Product not found!", statusCode: 400};

        if (product.stock < quantity) return {data: "Low stock for item!", statusCode: 400};

        cart.items.push({
            product: productId,
            unitPrice: product.price,
            quantity: quantity
        });

        cart.totalAmount += product.price * quantity; 
        const updatedCart = await cart.save();

        return {data: updatedCart, statusCode: 200};
    } catch (error) {
        console.error("Error in addItemToCart:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

interface UpdateItemInCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const updateItemInCart = async({productId, quantity, userId}: UpdateItemInCart) => {
    try {
        const cart = await getActiveCartForUser({userId});
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (!existsInCart) return {data: "Item not found in cart!", statusCode: 400};

        const product = await productModel.findById(productId);
        if (!product) return {data: "Product not found!", statusCode: 400};

        if (product.stock < quantity) return {data: "Low stock for item!", statusCode: 400};

        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
        let total = calculateCartTotalAmount({cartItems: otherCartItems});

        existsInCart.quantity = quantity;
        total += existsInCart.quantity * existsInCart.unitPrice;
        cart.totalAmount = total;

        const updatedCart = await cart.save();
        return {data: updatedCart, statusCode: 200};
    } catch (error) {
        console.error("Error in updateItemInCart:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

interface DeleteItemInCart {
    productId: any;
    userId: string;
}

export const deleteItemInCart = async ({userId, productId}: DeleteItemInCart) => {
    try {
        const cart = await getActiveCartForUser({userId});
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (!existsInCart) return {data: "Item not found in cart!", statusCode: 400};

        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
        const total = calculateCartTotalAmount({cartItems: otherCartItems});

        cart.items = otherCartItems;
        cart.totalAmount = total;
        const updatedCart = await cart.save();

        return {data: updatedCart, statusCode: 200};
    } catch (error) {
        console.error("Error in deleteItemInCart:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

interface Checkout {
    userId: string;
    address: string;
}

export const checkout = async ({userId, address}: Checkout) => {
    try {
        if (!address) return {data: "Address is required for checkout!", statusCode: 400};

        const cart = await getActiveCartForUser({userId});
        const orderItems: IOrderItem[] = [];

        for (const item of cart.items) {
            const product = await productModel.findById(item.product);  
            if (!product) return {data: "Product not found!", statusCode: 400};

            const orderItem: IOrderItem = {
                productTitle: product.title,
                productImage: product.image,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            };

            orderItems.push(orderItem);
        }

        const order = await orderModel.create({
            orderItems,
            total: cart.totalAmount,
            address,
            userId
        });

        await order.save();
        cart.status = "completed";
        await cart.save();

        return {data: order, statusCode: 200};
    } catch (error) {
        console.error("Error in checkout:", error);
        return {data: "Internal Server Error", statusCode: 500};
    }
};

const calculateCartTotalAmount = ({cartItems}: {cartItems: ICartItem[]}) => {
    return cartItems.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0);
};
