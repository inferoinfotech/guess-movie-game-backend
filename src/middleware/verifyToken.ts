import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../config'

export interface AuthRequest extends Request {
    userId?: string
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        if (!CONFIG.JWT_SECRET) {
            return res
                .status(500)
                .json({ message: 'JWT secret not configured' })
        }
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET)
        if (
            typeof decoded === 'object' &&
            decoded !== null &&
            'userId' in decoded &&
            typeof (decoded as any).userId === 'string'
        ) {
            req.userId = (decoded as any).userId
            next()
        } else {
            return res.status(401).json({ message: 'Invalid token payload' })
        }
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
