import express from 'express';
import { signIn, signUp } from '../controllers/authControllers.js';
const router = express.Router();

router.post('/auth/sign-up', signUp);
router.post('/auth/sign-in', signIn);

export default router;