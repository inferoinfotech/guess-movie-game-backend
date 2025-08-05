import { ContentType, ContentStatus } from '../../constants'
import mongoose, { Schema, Document } from 'mongoose'

export interface IContent extends Document {
    type: ContentType
    questionText?: string
    imageUrl?: string
    answer: string
    status: ContentStatus
    createdBy: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const ContentSchema = new Schema<IContent>(
    {
        type: {
            type: String,
            enum: Object.values(ContentType),
            required: true,
        },
        questionText: {
            type: String,
            required: function () {
                return this.type === ContentType.DIALOGUE
            },
        },
        imageUrl: {
            type: String,
            required: function () {
                return this.type !== ContentType.DIALOGUE
            },
        },
        answer: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(ContentStatus),
            default: ContentStatus.PENDING,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
)

export default mongoose.model<IContent>('Content', ContentSchema)
