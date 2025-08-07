// src/socket/gameEngine.ts
import { io } from '.' // import io instance
import Room from '../models/v1/Room'
import { getRandomQuestion } from '../services/QuestionService'

type RoomGameState = {
    round: number
    maxRounds: number
    players: {
        userId: string
        username: string
        score: number
        socketId: string
    }[]
    answered: Set<string>
    currentQuestion: any
    timeout?: NodeJS.Timeout
}

export const roomGames = new Map<string, RoomGameState>()

export async function sendNextQuestion(roomCode: string) {
    try {
        const room = await Room.findOne({ code: roomCode })
        if (!room) return

        const game = roomGames.get(roomCode)
        if (!game) return

        game.round += 1
        const { language, questionTypes } = room.settings
        const question = await getRandomQuestion({
            language,
            types: questionTypes,
        })
        game.currentQuestion = question
        game.answered = new Set()

        io.to(roomCode).emit('next-question', {
            round: game.round,
            totalRounds: room.settings.rounds,
            question: {
                id: question?._id,
                type: question?.type,
                questionText: question?.questionText,
                imageUrl: question?.imageUrl,
            },
            timeLimit: room.settings.timePerQuestion,
        })

        if (game.timeout) clearTimeout(game.timeout)

        game.timeout = setTimeout(() => {
            // will implement this later
            console.log(
                `[Timer] Round ${game.round} ended for room ${roomCode}`,
            )
        }, room.settings.timePerQuestion * 1000)
    } catch (error) {
        console.error('Error sending next question:', error)
    }
}
