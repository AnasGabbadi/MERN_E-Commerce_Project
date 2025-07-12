import mongoose, {Schema,Document} from "mongoose";

export interface IUser extends Document {
    userName: String,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    userName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
})

const userModel = mongoose.model<IUser>('User', userSchema);

export default userModel;