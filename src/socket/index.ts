import { Server, Socket } from 'socket.io'
import { verifyJwt } from '../utils/jwt' // make sure you have this
import { roomGames } from './gameEngine'
let ioInstance: Server

export const setupSocket = (server: Server) => {
    ioInstance = server
    ioInstance.on('connection', (socket: Socket) => {
        const token =
            socket.handshake.auth?.token || socket.handshake.headers?.token
        const decoded = verifyJwt(token) as any
        if (!decoded || !decoded.userId) {
            socket.disconnect(true)
            return
        }

        const userId = decoded.userId
        // disconnect event
        const disconnectedUsers = new Map() // userId => timeoutId

        // === CREATE ROOM ===
        socket.on('create-room', ({ roomCode }, callback) => {
            socket.join(roomCode)
            socket.data = { userId, roomCode, isLeader: true }

            if (typeof callback === 'function') {
                callback({
                    status: 'success',
                    roomCode,
                    message: `Room ${roomCode} created by user ${userId}`,
                })
            }

            ioInstance.to(roomCode).emit('room-update', {
                users: [{ userId, isLeader: true }],
            })
        })

        // === JOIN ROOM ===
        socket.on('join-room', ({ roomCode }, callback) => {
            const room = ioInstance.sockets.adapter.rooms.get(roomCode)
            console.log(ioInstance.sockets.adapter.rooms)
            if (!room) {
                if (typeof callback === 'function') {
                    return callback({
                        status: 'error',
                        message: `Room ${roomCode} does not exist.`,
                    })
                }
                return
            }

            // Prevent duplicate userId in same room
            const isUserAlreadyInRoom = Array.from(room).some((socketId) => {
                const s = ioInstance.sockets.sockets.get(socketId)
                return s?.data?.userId === userId
            })

            if (isUserAlreadyInRoom) {
                if (typeof callback === 'function') {
                    return callback({
                        status: 'error',
                        message: `User already in the room.`,
                    })
                }
                return
            }

            socket.join(roomCode)
            socket.data = { userId, roomCode, isLeader: false }

            if (typeof callback === 'function') {
                callback({
                    status: 'success',
                    roomCode,
                    message: `User ${userId} joined room ${roomCode}`,
                })
            }

            // Get all users in room
            const usersInRoom = Array.from(room)
                .map((socketId) => {
                    const s = ioInstance.sockets.sockets.get(socketId)
                    return s?.data
                        ? { userId: s.data.userId, isLeader: s.data.isLeader }
                        : null
                })
                .filter(Boolean)

            ioInstance.to(roomCode).emit('room-update', {
                users: usersInRoom,
            })
        })

        // === REJOIN ROOM ===
        socket.on('rejoin-room', ({ roomCode }, callback) => {
            const timeoutId = disconnectedUsers.get(userId)
            if (timeoutId) {
                clearTimeout(timeoutId)
                disconnectedUsers.delete(userId)
            }

            socket.join(roomCode)
            socket.data = { userId, roomCode, isLeader: false }

            const room = ioInstance.sockets.adapter.rooms.get(roomCode)
            const usersInRoom = room
                ? Array.from(room)
                      .map((socketId) => {
                          const s = ioInstance.sockets.sockets.get(socketId)
                          return s?.data?.userId
                              ? {
                                    userId: userId,
                                    isLeader: s.data.isLeader,
                                }
                              : null
                      })
                      .filter(Boolean)
                : []

            ioInstance.to(roomCode).emit('room-update', {
                users: usersInRoom,
                message: `${socket.data.userId} rejoined the room.`,
            })

            callback?.({
                status: 'success',
                message: `Welcome back, ${socket.data.userId}!`,
            })
        })

        // === SUBMIT ANSWER ===
        socket.on('submit-answer', ({ roomCode, answer }) => {
            const game = roomGames.get(roomCode)
            if (!game) return
            console.log('answer--->', game.players)
            const player = game.players.find((p) => p.userId === userId)
            if (!player) return

            // Prevent duplicate submissions
            if (game.answered.has(userId)) return

            game.answered.add(userId)
            player.latestAnswer = answer

            console.log(`[Answer] ${player.username} answered: ${answer}`)

            // If all players have answered, end round early
            if (game.answered.size === game.players.length) {
                console.log(
                    `[Round] All users submitted early. Waiting for timer to end...`,
                )
            }
        })

        // === DISCONNECT EVENT ===
        socket.on('disconnect', () => {
            const { roomCode, username } = socket.data || {}
            if (!roomCode) return

            const timeoutId = setTimeout(() => {
                socket.leave(roomCode)

                const room = ioInstance.sockets.adapter.rooms.get(roomCode)
                const usersInRoom = room
                    ? Array.from(room)
                          .map((socketId) => {
                              const s = ioInstance.sockets.sockets.get(socketId)
                              return s?.data?.userId
                                  ? {
                                        userId: userId,
                                        isLeader: s.data.isLeader,
                                    }
                                  : null
                          })
                          .filter(Boolean)
                    : []

                ioInstance.to(roomCode).emit('room-update', {
                    users: usersInRoom,
                    message: `${username} left the room.`,
                })

                disconnectedUsers.delete(userId)
            }, 10000) // 10 seconds grace period

            disconnectedUsers.set(userId, timeoutId)
            console.log(disconnectedUsers)
        })
    })
}

export { ioInstance as io }
