import { Router } from 'express'
import { verifyToken } from '../../middleware/verifyToken'
import { requireRole } from '../../middleware/requireRole'
import { Roles } from '../../constants'
import { ContentController } from '../../controllers/v1/ContentController'

const router = Router()

const contentController = new ContentController()

router.post('/', verifyToken, contentController.createContent)
router.get('/', verifyToken, contentController.getMyContents)
router.delete('/:id', verifyToken, contentController.deleteContent)

// Admin/Monitor routes
router.get(
    '/admin/contents',
    verifyToken,
    requireRole(Roles.ADMIN, Roles.MONITOR),
    contentController.getAllContents,
)
router.patch(
    '/admin/contents/:id',
    verifyToken,
    requireRole(Roles.ADMIN, Roles.MONITOR),
    contentController.moderateContent,
)

export default router
