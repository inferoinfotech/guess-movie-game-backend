import { UserService } from '@/services/UserService'
import { NextFunction, Response } from 'express'
import { Logger } from 'winston'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async updateRole(req: any, res: Response, next: NextFunction) {
        try {
            const updated = await this.userService.updateRole(
                req.params.id,
                req.body.role,
            )
            res.status(200).json(updated)
        } catch (err) {
            next(err)
        }
    }

    async listUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.findAll()
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }
}
