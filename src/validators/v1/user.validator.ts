import { Roles } from '../../constants'
import { checkSchema } from 'express-validator'

export const updateRoleValidator = checkSchema({
    role: {
        in: ['body'],
        notEmpty: true,
        isIn: {
            options: [[Roles.ADMIN, Roles.MONITOR, Roles.USER]],
            errorMessage: 'Invalid role',
        },
    },
})
