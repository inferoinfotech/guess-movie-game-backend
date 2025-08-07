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
        const submittedCorrectly = player.latestAnswer === correctAnswer

        if (didAnswer && submittedCorrectly) {
            player.score += 1
        }

        resultPerPlayer.push({
            userId: player.userId,
            username: player.username,
            answered: didAnswer,
            correct: didAnswer && submittedCorrectly,
            score: player.score,
        })

        // Clear latestAnswer for next round
        player.latestAnswer = undefined
    }

    // Emit round result
    io.to(roomCode).emit('round-result', {
        round: game.round,
        correctAnswer,
        results: resultPerPlayer,
    })

    // Proceed to next round after short delay (e.g., 5 sec)
    if (game.round >= game.maxRounds) {
        io.to(roomCode).emit('game-over', {
            leaderboard: resultPerPlayer.sort((a, b) => b.score - a.score),
        })
        roomGames.delete(roomCode) // Clean up game state
    } else {
        setTimeout(() => {
            sendNextQuestion(roomCode)
        }, 5000) // Delay before next question
    }
}
