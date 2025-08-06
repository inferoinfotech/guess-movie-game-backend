import { Server, Socket } from 'socket.io'

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('🟢 Socket connected:', socket.id)

        // Join room
        socket.on('join-room', ({ roomCode, userId }) => {
            socket.join(roomCode)
            console.log(`User ${userId} joined ${roomCode}`)
            io.to(roomCode).emit('user-joined', { userId })
        })

        // Send question
        socket.on('start-question', ({ roomCode, question }) => {
            io.to(roomCode).emit('new-question', question)
        })

        // Submit answer
        socket.on('submit-answer', ({ roomCode, userId, answer }) => {
            io.to(roomCode).emit('answer-submitted', { userId, answer })
        })

        // Disconnect
        socket.on('disconnect', () => {
            console.log('🔴 Socket disconnected:', socket.id)
        })
    })
}
