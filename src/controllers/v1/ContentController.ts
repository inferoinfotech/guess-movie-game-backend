import { Request, Response } from 'express'
import Content from '../../models/v1/Content'
import { AuthRequest } from '../../middleware/verifyToken'
import { ContentStatus, ContentType } from '../../constants'

export class ContentController {
    createContent = async (req: AuthRequest, res: Response) => {
        try {
            const { type, answer, questionText, imageUrl } = req.body

            if (!type || !answer || (!questionText && !imageUrl)) {
                return res
                    .status(400)
                    .json({ message: 'Missing required fields' })
            }

            const newContent = await Content.create({
                type,
                answer,
                questionText,
                imageUrl,
                createdBy: req.user?.id,
            })

            return res.status(201).json(newContent)
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err })
        }
    }

    getMyContents = async (req: AuthRequest, res: Response) => {
        try {
            const contents = await Content.find({ createdBy: req.user?.id })
            return res.json(contents)
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err })
        }
    }

    deleteContent = async (req: AuthRequest, res: Response) => {
        try {
            const content = await Content.findById(req.params.id)
            if (!content) return res.status(404).json({ message: 'Not found' })
            if (content.createdBy.toString() !== req.user?.id) {
                return res.status(403).json({ message: 'Not allowed' })
            }
            await content.deleteOne()
            return res.json({ message: 'Deleted successfully' })
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err })
        }
    }

    getAllContents = async (_req: Request, res: Response) => {
        try {
            const contents = await Content.find()
            return res.json(contents)
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err })
        }
    }

    moderateContent = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            if (!Object.values(ContentStatus).includes(status)) {
                return res.status(400).json({ message: 'Invalid status' })
            }
            const content = await Content.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true },
            )
            if (!content)
                return res.status(404).json({ message: 'Content not found' })
            return res.json(content)
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err })
        }
    }
}
