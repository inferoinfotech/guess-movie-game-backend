import { Roles } from '@/constants'
import { NextFunction, Response } from 'express'
import { AuthRequest } from './verifyToken'

export const requireRole = (...roles: Roles[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role as Roles)) {
            return res
                .status(403)
                .json({ message: 'Forbidden: Insufficient role' })
        }
        next()
    }
}
