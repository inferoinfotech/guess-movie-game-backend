import { Router } from 'express'
import authRoute from './auth'
import userRoute from './user'
import contentRoute from './content'
import gameRoute from './game'
import multiplayerRoute from './multiplayer'

const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/contents', contentRoute)
router.use('/game', gameRoute)
router.use('/multiplayer', multiplayerRoute)

export default router
