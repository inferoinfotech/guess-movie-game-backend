import { Request, Response } from 'express'
import Room from '../../models/v1/Room'
import { generateRoomCode } from '../../utils/generateRoomCode'
import { io } from '../../socket'
import logger from '../../config/logger'
import { roomGames, sendNextQuestion } from '../../socket/gameEngine'

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

    joinRoom = async (req: any, res: Response) => {
        try {
            const { roomCode } = req.body
            const userId = req.user.id

            const room = await Room.findOne({ code: roomCode })

            if (!room) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Room not found' })
            }

            // Prevent joining after game started
            if (room.isStarted) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Game already started' })
            }

            // Prevent duplicate join
            const alreadyJoined = room.participants.some(
                (p) => p.user?.toString() === userId,
            )
            if (alreadyJoined) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Already joined' })
            }

            room.participants.push({
                user: userId,
                joinedAt: new Date(),
            })
            await room.save()

            return res.status(200).json({ success: true, data: room })
        } catch (err) {
            return res
                .status(500)
                .json({ success: false, message: 'Error joining room' })
        }
    }

    startGame = async (req: any, res: Response) => {
        try {
            const { roomCode } = req.body
            const userId = req.user.id

            const room = await Room.findOne({ code: roomCode })

            if (!room) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Room not found' })
            }

            if (room.leader.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'Only leader can start the game',
                })
            }

            if (room.isStarted) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Game already started' })
            }

            room.isStarted = true
            await room.save()

            // Emit event to all participants
            io.to(roomCode).emit('game-started', {
                message: 'Game has started!',
                round: 1,
                totalRounds: room?.settings?.rounds,
                countdownBeforeStart: 5, // optional: send this info to client
            })

            // Initialize game state
            roomGames.set(room.code, {
                round: 0, // starts at 0, will increment to 1 in sendNextQuestion
                maxRounds: room.settings.rounds,
                players: room.participants.map((p) => ({
                    userId: p.user.toString(),
                    username: '', // optionally fetch username here
                    score: 0,
                    socketId: '', // optionally attach when player joins socket
                })),
                answered: new Set(),
                currentQuestion: null,
            })

            // ⏳ Wait 5 seconds before round 1 begins
            setTimeout(() => {
                sendNextQuestion(roomCode)
            }, 5000)

            return res
                .status(200)
                .json({ success: true, message: 'Game started successfully' })
        } catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({ success: false, message: 'Error starting game' })
        }
    }
}
