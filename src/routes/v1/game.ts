import express from 'express'
import { GameController } from '../../controllers/v1/GameController'
import { verifyToken } from '../../middleware/verifyToken'

const router = express.Router()

const gameController = new GameController()

router.get(
    '/single-player',
    verifyToken,
    gameController.getSinglePlayerQuestions,
)
router.post(
    '/single-player/submit',
    verifyToken,
    gameController.submitSinglePlayerAnswer,
)

export default router
