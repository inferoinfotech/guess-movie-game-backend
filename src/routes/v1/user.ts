import { Router, Request, Response, NextFunction } from 'express'
import { UserController } from '../../controllers/v1/UserController'
import logger from '../../config/logger'
import { UserService } from '../../services/UserService'
import { verifyToken } from '../../middleware/verifyToken'
import { requireRole } from '../../middleware/requireRole'
import { Roles } from '../../constants'
import { updateRoleValidator } from '../../validators/v1/user.validator'

const router = Router()

// instantiate controller with services
const userController = new UserController(new UserService(), logger)

router.patch(
    '/role/:id',
    verifyToken,
    requireRole(Roles.ADMIN),
    updateRoleValidator,
    (req: Request, res: any, next: NextFunction) =>
        userController.updateRole(req, res, next),
)

router.get(
    '/',
    verifyToken,
    requireRole(Roles.ADMIN),
    (req: any, res: Response, next: NextFunction) =>
        userController.listUsers(req, res, next),
)

export default router
