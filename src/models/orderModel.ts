import mongoose, { ObjectId } from "mongoose";

export interface IOrderItem {
    productTitle: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
}

export interface IOrder extends Document {
    orderItems: IOrderItem[];
    total: number;
    address: string;
    userId: ObjectId | string;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true }, 
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<IOrder>({
    orderItems: [orderItemSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;