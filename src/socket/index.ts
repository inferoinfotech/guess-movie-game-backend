import { Server, Socket } from 'socket.io'
import { verifyJwt } from '../utils/jwt' // make sure you have this
import { decode } from 'punycode'

export const setupSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
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

            io.to(roomCode).emit('room-update', {
                users: [{ userId, isLeader: true }],
            })
        })

        // === JOIN ROOM ===
        socket.on('join-room', ({ roomCode }, callback) => {
            const room = io.sockets.adapter.rooms.get(roomCode)
            console.log(io.sockets.adapter.rooms)
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
                const s = io.sockets.sockets.get(socketId)
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
                    const s = io.sockets.sockets.get(socketId)
                    return s?.data
                        ? { userId: s.data.userId, isLeader: s.data.isLeader }
                        : null
                })
                .filter(Boolean)

            io.to(roomCode).emit('room-update', {
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

            const room = io.sockets.adapter.rooms.get(roomCode)
            const usersInRoom = room
                ? Array.from(room)
                      .map((socketId) => {
                          const s = io.sockets.sockets.get(socketId)
                          return s?.data?.userId
                              ? {
                                    userId: userId,
                                    isLeader: s.data.isLeader,
                                }
                              : null
                      })
                      .filter(Boolean)
                : []

            io.to(roomCode).emit('room-update', {
                users: usersInRoom,
                message: `${socket.data.userId} rejoined the room.`,
            })

            callback?.({
                status: 'success',
                message: `Welcome back, ${socket.data.userId}!`,
            })
        })

        // === DISCONNECT EVENT ===
        socket.on('disconnect', () => {
            const { roomCode, username } = socket.data || {}
            if (!roomCode) return

            const timeoutId = setTimeout(() => {
                socket.leave(roomCode)

                const room = io.sockets.adapter.rooms.get(roomCode)
                const usersInRoom = room
                    ? Array.from(room)
                          .map((socketId) => {
                              const s = io.sockets.sockets.get(socketId)
                              return s?.data?.userId
                                  ? {
                                        userId: userId,
                                        isLeader: s.data.isLeader,
                                    }
                                  : null
                          })
                          .filter(Boolean)
                    : []

                io.to(roomCode).emit('room-update', {
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
