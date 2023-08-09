import { Router } from 'express';

import userRouter from './userRoutes.js';
import storeRouter from './storeRoutes.js';
import registerRouter from './registerRoutes.js';
import patioRouter from './patioRoutes.js';

const router = Router();

router.use('/api/user', userRouter);
router.use('/api/store', storeRouter);
router.use('/api/register', registerRouter);
router.use('/api/patio', patioRouter);

export default router;
