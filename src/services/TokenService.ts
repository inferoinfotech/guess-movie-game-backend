import jwt from 'jsonwebtoken'
import { CONFIG } from '../config'

export class TokenService {
    generateAccessToken(userId: string): string {
        return jwt.sign({ userId }, CONFIG.JWT_SECRET!, { expiresIn: '15m' })
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, CONFIG.JWT_REFRESH_SECRET!, {
            expiresIn: '7d',
        })
    }

    verifyToken(token: string): any {
        return jwt.verify(token, CONFIG.JWT_SECRET!)
    }

    verifyRefreshToken(token: string): any {
        return jwt.verify(token, CONFIG.JWT_REFRESH_SECRET!)
    }
}
