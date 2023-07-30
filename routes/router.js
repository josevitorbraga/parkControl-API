import { Router } from 'express';

import userRouter from './userRoutes.js';
import storeRouter from './storeRoutes.js';
import registerRouter from './registerRoutes.js';

const router = Router();

router.use('/api/user', userRouter);
router.use('/api/store', storeRouter);
router.use('/api/register', registerRouter);

export default router;
