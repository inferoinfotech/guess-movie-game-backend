import mongoose, { Schema, Document } from 'mongoose'
import { Roles, UserStatus, Languages } from '../../constants'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    avatar?: string
    role: Roles
    language: Languages
    points: number
    status: UserStatus
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String },
        role: {
            type: String,
            enum: Object.values(Roles),
            default: Roles.USER,
        },
        language: {
            type: String,
            enum: Object.values(Languages),
            default: Languages.EN,
        },
        points: { type: Number, default: 0 },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.ACTIVE,
        },
    },
    { timestamps: true },
)

export const User = mongoose.model<IUser>('User', userSchema)
