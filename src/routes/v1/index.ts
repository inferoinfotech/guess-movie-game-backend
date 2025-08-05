import { Router } from 'express'
import authRoute from './auth'
import userRoute from './user'
import contentRoute from './content'

const router = Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/contents', contentRoute)

export default router
