import express from 'express';
import { showRanking,listShortUsers,deleteShort,openShort,showShort,shortLink } from "../controllers/shortControllers.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/urls/shorten', shortLink);
router.get('/urls/:id', showShort);
router.get('/urls/open/:shortUrl', openShort );
router.delete('/urls/:id', authMiddleware, deleteShort );
router.get('/users/me', authMiddleware, listShortUsers );
router.get('/ranking', showRanking);

export default router;