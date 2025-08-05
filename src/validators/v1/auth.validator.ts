import { checkSchema } from 'express-validator'

export const registerValidator = checkSchema({
    email: {
        errorMessage: 'email is missing',
        trim: true,
        notEmpty: true,
        isEmail: {
            errorMessage: 'invalid email',
        },
    },
    name: {
        errorMessage: 'name is missing',
        trim: true,
        notEmpty: true,
    },
    password: {
        errorMessage: 'password is missing',
        trim: true,
        notEmpty: true,
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 chars',
        },
    },
})

export const loginValidator = checkSchema({
    email: {
        errorMessage: 'Email is required',
        trim: true,
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid email',
        },
    },
    password: {
        errorMessage: 'Password is required',
        trim: true,
        notEmpty: true,
    },
})
