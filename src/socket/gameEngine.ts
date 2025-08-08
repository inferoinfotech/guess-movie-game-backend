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
        latestAnswer?: string
    }[]
    answered: Set<string>
    usedQuestionIds: Set<string>
    currentQuestion: any
    correctAnswer: string
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
        const question: any = await getRandomQuestion({
            language,
            types: questionTypes,
        })
        game.currentQuestion = question
        game.correctAnswer = question.answer
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
            console.log(
                `[Timer] Round ${game.round} ended for room ${roomCode}`,
            )
            endRound(roomCode)
        }, room.settings.timePerQuestion * 1000)
    } catch (error) {
        console.error('Error sending next question:', error)
    }
}

export async function endRound(roomCode: string) {
    const game = roomGames.get(roomCode)
    if (!game) return

    console.log(`[End Round] Ending round ${game.round} in room ${roomCode}`)

    if (game.round >= game.maxRounds) {
        io.to(roomCode).emit('game-over', {
            leaderboard: game.players
                .map((p) => ({
                    username: p.username,
                    score: p.score,
                }))
                .sort((a, b) => b.score - a.score), // sort high to low
            message: 'Game Over!',
        })

        roomGames.delete(roomCode) // cleanup
        return
    }

    const correctAnswer = game.currentQuestion?.answer
    const resultPerPlayer: {
        userId: string
        username: string
        answered: boolean
        correct: boolean
        score: number
    }[] = []

    for (const player of game.players) {
        const didAnswer = game.answered.has(player.userId)
        const isCorrect =
            didAnswer &&
            player.latestAnswer?.trim().toLowerCase() ===
                correctAnswer?.trim().toLowerCase()

        if (isCorrect) {
            player.score += 1
        }

        const result = {
            userId: player.userId,
            username: player.username,
            answered: didAnswer,
            correct: isCorrect,
            score: player.score,
        }

        player.latestAnswer = undefined
        return result
    }

    io.to(roomCode).emit('round-result', {
        round: game.round,
        correctAnswer,
        results: resultPerPlayer,
    })

    // Game over
    if (game.round >= game.maxRounds) {
        io.to(roomCode).emit('game-over', {
            leaderboard: resultPerPlayer.sort((a, b) => b.score - a.score),
            message: 'Game Over!',
        })
        roomGames.delete(roomCode)
    } else {
        // Proceed to next round
        setTimeout(() => {
            sendNextQuestion(roomCode)
        }, 5000)
    }
}
