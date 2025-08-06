import { Request, Response } from 'express'
import Content from '../../models/v1/Content'

export class GameController {
    getSinglePlayerQuestions = async (req: Request, res: Response) => {
        try {
            const { type = 'frame', count = 10 } = req.query

            const limit = parseInt(count as string, 10) || 10
            const filter: any = { status: 'approved' }

            if (type) filter.type = type

            const questions = await Content.aggregate([
                { $match: filter },
                { $sample: { size: limit } },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        options: 1,
                        imageUrl: 1,
                        dialogue: 1,
                        eyeImageUrl: 1,
                        uploadedBy: 1,
                        createdAt: 1,
                    },
                },
            ])

            return res.status(200).json({
                success: true,
                message: 'Fetched single-player questions',
                data: questions,
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch single-player questions',
            })
        }
    }
}
