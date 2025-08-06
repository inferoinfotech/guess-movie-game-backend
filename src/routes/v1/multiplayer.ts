import { Router } from 'express'
import { verifyToken } from '../../middleware/verifyToken'
import { MultiplayerController } from '../../controllers/v1/MultiplayerController'

const router = Router()

const multiplayerController = new MultiplayerController()

router.post('/rooms', verifyToken, multiplayerController.createRoom)
router.post('/rooms/join', verifyToken, multiplayerController.joinRoom)
router.post('/rooms/start', verifyToken, multiplayerController.startGame)

export default router
