import { Router, Request, Response, NextFunction } from 'express'
import {
    loginValidator,
    registerValidator,
} from '../../validators/v1/auth.validator'
import { AuthController } from '../../controllers/v1/AuthController'
import logger from '../../config/logger'
import { CredentialService } from '../../services/CredentialService'
import { TokenService } from '../../services/TokenService'
import { UserService } from '../../services/UserService'
import { AuthRequest, verifyToken } from '../../middleware/verifyToken'

const router = Router()

// instantiate controller with services
const authController = new AuthController(
    new UserService(),
    logger,
    new TokenService(),
    new CredentialService(),
)

router.post(
    '/register',
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

router.post(
    '/login',
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

router.get(
    '/me',
    verifyToken,
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const user = await authController.getProfile(req.userId!)
            if (!user)
                return res.status(404).json({ message: 'User not found' })
            res.json(user)
        } catch (err) {
            next(err)
        }
    },
)

export default router
