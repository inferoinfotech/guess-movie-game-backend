import mongoose, { Document, Types } from 'mongoose'

export interface RoomSettings {
    rounds: number
    timePerQuestion: number
    questionTypes: string[] // ['dialogue', 'frame', 'eyes']
    language: string
}

export interface RoomParticipant {
    user: Types.ObjectId
    joinedAt: Date
}

export interface RoomDocument extends Document {
    name?: string
    code: string
    leader: Types.ObjectId
    participants: RoomParticipant[]
    settings: RoomSettings
    isStarted: boolean
    isEnded: boolean
    createdAt: Date
    updatedAt: Date
}

const roomSchema = new mongoose.Schema<RoomDocument>(
    {
        name: { type: String },
        code: { type: String, required: true, unique: true }, // NEW
        leader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        participants: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        settings: {
            rounds: { type: Number, default: 10 },
            timePerQuestion: { type: Number, default: 15 },
            questionTypes: {
                type: [String],
                default: ['dialogue', 'frame', 'eyes'],
            },
            language: { type: String, default: 'en' },
        },
        isStarted: { type: Boolean, default: false },
        isEnded: { type: Boolean, default: false },
    },
    { timestamps: true },
)

export default mongoose.model<RoomDocument>('Room', roomSchema)
