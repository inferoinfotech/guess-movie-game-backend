import { CONFIG } from './config'
import app from './app'
import logger from './config/logger'
import { initDb } from './config/db'
import http from 'http'
import { Server } from 'socket.io'
import { setupSocket } from './socket'

const PORT = CONFIG.PORT || 8000

const startServer = async (port: number) => {
    try {
        await initDb()

        // Create HTTP server and attach Socket.IO
        const server = http.createServer(app)

        const io = new Server(server, {
            cors: {
                origin: '*', // 🔐 Replace with frontend URL in production
                credentials: true,
            },
        })

        // Setup socket listeners
        setupSocket(io)

        server.listen(port, () => {
            logger.info(`🚀 Server listening on http://localhost:${port}`)
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error('❌ Failed to start server:', error.message)
            setTimeout(() => process.exit(1), 1000)
        }
    }
}

startServer(PORT as number)
