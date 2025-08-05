import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { Logger } from 'winston'
import { UserService } from '@/services/UserService'
import { TokenService } from '@/services/TokenService'
import { CredentialService } from '@/services/CredentialService'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
    ) {}

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { name, email, password } = req.body

            const existing = await this.userService.findByEmail(email)
            if (existing) {
                return res.status(409).json({ message: 'Email already in use' })
            }

            const hashedPassword =
                await this.credentialService.hashPassword(password)

            const user = await this.userService.create({
                name,
                email,
                password: hashedPassword,
            })

            const accessToken = this.tokenService.generateAccessToken(
                String(user._id),
            )

            return res.status(201).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    language: user.language,
                    points: user.points,
                },
                accessToken,
            })
        } catch (err) {
            this.logger.error('Error in register:', err)
            return next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { email, password } = req.body

            const user = await this.userService.findByEmail(email)
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' })
            }

            const isMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            )
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' })
            }

            const accessToken = this.tokenService.generateAccessToken(
                String(user._id),
            )

            return res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    language: user.language,
                    points: user.points,
                },
                accessToken,
            })
        } catch (err) {
            this.logger.error('Error in login:', err)
            return next(err)
        }
    }

    async getProfile(userId: string) {
        const user = await this.userService.findById(userId)
        if (!user) return null

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            language: user.language,
            points: user.points,
        }
    }
}
