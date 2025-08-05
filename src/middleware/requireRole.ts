import { Roles } from '@/constants'
import { NextFunction, Response } from 'express'
import { AuthRequest } from './verifyToken'

export const requireRole = (role: Roles) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res
                .status(403)
                .json({ message: 'Forbidden: Insufficient role' })
        }
        next()
    }
}
