import { Router } from 'express'
import { verifyToken } from '../../middleware/verifyToken'
import { MultiplayerController } from '../../controllers/v1/MultiplayerController'

const router = Router()

const multiplayerController = new MultiplayerController()

router.post('/rooms', verifyToken, multiplayerController.createRoom)

export default router
