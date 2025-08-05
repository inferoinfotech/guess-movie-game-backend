import { config } from 'dotenv'
config()

const { PORT, NODE_ENV, DB_URI } = process.env

export const CONFIG = {
    PORT,
    NODE_ENV,
    DB_URI,
}
