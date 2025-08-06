import express from 'express'
import { GameController } from '../../controllers/v1/GameController'
import { verifyToken } from '../../middleware/verifyToken'

const router = express.Router()

const { getSinglePlayerQuestions } = new GameController()

router.get('/single-player', verifyToken, getSinglePlayerQuestions)

export default router
