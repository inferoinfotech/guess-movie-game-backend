import { config } from 'dotenv'
import path from 'path'

const env = process.env.NODE_ENV
const envFile = env ? `.env.${env}` : `.env`
config({
    path: path.join(__dirname, `../../${envFile}`),
})

const { PORT, NODE_ENV, DB_URI } = process.env

export const CONFIG = {
    PORT,
    NODE_ENV,
    DB_URI,
}
