import { Router } from 'express'
import authRoute from './auth'
import userRoute from './user'
import contentRoute from './content'
import gameRoute from './game'

const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/contents', contentRoute)
router.use('/game', gameRoute)

export default router
