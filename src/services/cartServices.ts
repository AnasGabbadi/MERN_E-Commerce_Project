import { cartModel, ICart, ICartItem } from "../models/cartModel";
import productModel from "../models/productModel";

interface ICreateCartForUser {
    userId: String;
}

const CreateCartForUser = async ({userId}: ICreateCartForUser) => {
    const cart = await cartModel.create({userId, totalAmount: 0});
    await cart.save();
    return cart;
};

interface IGetActiveCartForUser {
    userId: string;
}

export const getActiveCartForUser = async ({userId}: IGetActiveCartForUser) => {
    let cart = await cartModel.findOne({userId, status: "active"});

    if (!cart) {
        cart = await CreateCartForUser({userId});
    }

    return cart;
};

interface ClearCart {
    userId: string;     
}

export const clearCart = async ({userId}: ClearCart) => {
    const cart = await getActiveCartForUser({userId});
    cart.items = [];
    cart.totalAmount = 0;
    const updatedCart = await cart.save();
    return {data: updatedCart, statusCode: 200};
};

interface AddItemToCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const addItemToCart = async ({productId, quantity, userId}: AddItemToCart) => {
    const cart = await getActiveCartForUser({userId});

    const existsInCart = cart.items.find((p) => p.product.toString() === productId);

    if (existsInCart) {
        return {data: "Item already exists in cart!", statusCode: 400};
    }

    const product = await productModel.findById(productId);

    if (!product) {
        return {data: "Product not found!", statusCode: 400};
    }

    if (product.stock < quantity) {
        return {data: "Low stock for item!", statusCode: 400};
    }

    cart.items.push({
        product: productId,
        unitPrice: product.price,
        quantity: quantity
    });

    cart.totalAmount += product.price * quantity; 

    const updatedCart = await cart.save();

    return {data: updatedCart, statusCode: 200};
};

interface UpdateItemInCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const updateItemInCart = async({productId, quantity, userId}: UpdateItemInCart) => {
    const cart = await getActiveCartForUser({userId});

    const existsInCart = cart.items.find((p) => p.product.toString() === productId);

    if (!existsInCart) {
        return {data: "Item already exists in cart!", statusCode: 400};
    }

    const product = await productModel.findById(productId);

    if (!product) {
        return {data: "Product not found!", statusCode: 400};
    }

    if (product.stock < quantity) {
        return {data: "Low stock for item!", statusCode: 400};
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    let total = calculateCartTotalAmount({cartItems: otherCartItems});

    existsInCart.quantity = quantity;
    total += existsInCart.quantity * existsInCart.unitPrice;

    cart.totalAmount = total;

    const updatedCart = await cart.save();

    return {data: updatedCart, statusCode: 200};
};

interface DeleteItemInCart {
    productId: any;
    userId: string;
}

export const deleteItemInCart = async ({userId, productId}: DeleteItemInCart) => {
    const cart = await getActiveCartForUser({userId});

    const existsInCart = cart.items.find((p) => p.product.toString() === productId);

    if (!existsInCart) {
        return {data: "Item not found in cart!", statusCode: 400};
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);

    const total = calculateCartTotalAmount({cartItems: otherCartItems});

    cart.items = otherCartItems;
    cart.totalAmount = total;
     
    const updatedCart = await cart.save();

    return {data: updatedCart, statusCode: 200};
}

const calculateCartTotalAmount = ({cartItems}: {cartItems: ICartItem[]}) => {
    const total = cartItems.reduce((sum, product) => {   
        sum += product.quantity * product.unitPrice;
        return sum;
    }, 0);

    return total;
}