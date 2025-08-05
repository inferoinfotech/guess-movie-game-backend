import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../config'
import { User } from '../models/v1/User'

export interface AuthRequest extends Request {
    user?: {
        id: string
        role: string
        email: string
        name?: string
    }
}

export const verifyToken = async (
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

        const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as {
            userId: string
        }

        const user = await User.findById(decoded.userId).select(
            '_id email role firstName lastName',
        )

        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }

        req.user = {
            id: (user._id as string).toString(),
            email: user.email,
            role: user.role,
            name: user.name,
        }

        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
