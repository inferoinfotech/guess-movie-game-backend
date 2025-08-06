import jwt from 'jsonwebtoken'
import { CONFIG } from '../config'

export const verifyJwt = (token: string) => {
    try {
        return jwt.verify(token, CONFIG.JWT_SECRET!)
    } catch (err) {
        return null
    }
}
