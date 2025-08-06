import { Request, Response } from 'express'
import Room from '../../models/v1/Room'
import { generateRoomCode } from '../../utils/generateRoomCode'

export class MultiplayerController {
    createRoom = async (req: any, res: Response) => {
        try {
            const { name, rounds, timePerQuestion, questionTypes, language } =
                req.body
            const leaderId = req.user.id

            let code: string
            let isUnique = false

            // Keep generating until we get a unique code
            while (!isUnique) {
                code = generateRoomCode()
                const exists = await Room.findOne({ code })
                if (!exists) isUnique = true
            }

            const roomName = name || `Room-${code!}`

            const room = await Room.create({
                code: code!,
                name: roomName,
                leader: leaderId,
                participants: [{ user: leaderId }],
                settings: {
                    rounds: rounds || 10,
                    timePerQuestion: timePerQuestion || 15,
                    questionTypes: questionTypes || [
                        'dialogue',
                        'frame',
                        'eyes',
                    ],
                    language: language || 'en',
                },
            })

            return res.status(201).json({ success: true, data: room })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create room',
            })
        }
    }
}
