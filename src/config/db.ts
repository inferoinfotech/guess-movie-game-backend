import mongoose from 'mongoose'
import logger from './logger'
import { CONFIG } from '.'

export const initDb = async () => {
    const dbUri = CONFIG.DB_URI

    if (!dbUri) {
        logger.error('❌ Database URI is not defined in environment variables')
        throw new Error('Database URI is missing')
    }

    try {
        await mongoose.connect(dbUri)
        logger.info('✅ Database connected successfully')
    } catch (err) {
        logger.error('❌ Database connection failed:', err)
        process.exit(1) // exit process if DB fails
    }
}
